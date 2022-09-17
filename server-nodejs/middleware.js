const { checkTokenInRedis } = require('./helpers/redis_helper');
const sendResponse = require('./helpers/sendResponse');
const tokenHelper = require('./helpers/token');
const db = require('./services/db.js');

const Middleware = {
  getUserIfCookieExists: async (req, res, next) => {
    var userId = tokenHelper.verify(req);
    if (!userId) {
      req.user = false;
      next();
    } else {
      var user = await db.query('SELECT * FROM user WHERE id = ?', [userId]);
      let userIdFromRedis = await checkTokenInRedis(tokenHelper.get(req));
      if (user.length === 0 || !userIdFromRedis || userIdFromRedis != userId) {
        console.log("User not found in Redis or Db or doesn't match");
        req.user = false;
        next();
      } else {
        req.user = user[0];
        next();
      }
    }
  },
  authUser: async (req, res, next) => {
    if (!req.user) {
      sendResponse.authError(res, 'Not logged in');
      return;
    }
    next();
  },
  authAdmin: async (req, res, next) => {
    if (!req.user) {
      sendResponse.authError(res, 'Not logged in');
      return;
    }
    if (req.user.roleFk !== 2) {
      sendResponse.authAdminError(res, 'Not admin');
      return;
    }
    next();
  },
};

module.exports = Middleware;
