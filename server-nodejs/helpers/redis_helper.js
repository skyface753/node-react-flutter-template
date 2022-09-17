const RedisClient = require('../services/redis');
const tokenHelper = require('./token');

async function addTokenToRedis(token, userId) {
  if (!token || !userId) return;
  await RedisClient.set(token, userId);
}

async function removeTokenFromRedis(token) {
  if (!token) return;
  await RedisClient.del(token);
}

async function checkTokenInRedis(token) {
  if (!token) return;
  const userId = await RedisClient.get(token);
  return userId ? userId : false;
}

async function cleanUpRedis() {
  // Wait 1 second before cleaning up Redis
  setTimeout(async () => {
    const allKeys = await RedisClient.getAllKeys();
    for (let i = 0; i < allKeys.length; i++) {
      if (!tokenHelper.verifyAToken(allKeys[i])) {
        console.log('Removing token from Redis: ' + allKeys[i]);
        await RedisClient.del(allKeys[i]);
      }
    }
  }, 1000);
}
var minutes = 1,
  the_interval = minutes * 60 * 1000;
setInterval(function () {
  console.log('Cleaning up Redis');
  cleanUpRedis();
}, the_interval);

module.exports = {
  addTokenToRedis,
  removeTokenFromRedis,
  checkTokenInRedis,
};
