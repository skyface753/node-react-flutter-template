const RedisClient = require('../services/redis');

async function addTokenToRedis(token, userId) {
  await RedisClient.set(token, userId);
}

async function removeTokenFromRedis(token) {
  await RedisClient.del(token);
}

async function checkTokenInRedis(token) {
  const userId = await RedisClient.get(token);
  return userId ? userId : false;
}

module.exports = {
  addTokenToRedis,
  removeTokenFromRedis,
  checkTokenInRedis,
};
