// const { checkTokenInRedis } = require('./helpers/redis_helper');
const sendResponse = require('./helpers/sendResponse');
// const tokenHelper = require('./helpers/token');
const db = require('./services/db.js');
const jwt = require('jsonwebtoken');
const config = require('./config.json');
const Middleware = {
  authUser: async (req, res, next) => {
    var token = req.cookies.jwt;
    if (!token) {
      return sendResponse.authError(res, 'Not logged in');
    }
    try {
      var payload = jwt.verify(token, config.JWT_SECRET);
      if (!payload) {
        return sendResponse.authError(res, 'Not logged in');
      }
      var user = await db.query('SELECT * FROM user WHERE id = ?', [
        payload.id,
      ]);
      if (user.length === 0) {
        return sendResponse.authError(res, 'User not found');
      }
      req.user = user[0];
      next();
    } catch (err) {
      catchError(err, res);
    }
  },
  authAdmin: async (req, res, next) => {
    var token = req.cookies.jwt;
    if (!token) {
      return sendResponse.authError(res, 'Not logged in');
    }
    try {
      var payload = jwt.verify(token, config.JWT_SECRET);
      if (!payload) {
        return sendResponse.authError(res, 'Not logged in');
      }
      var user = await db.query('SELECT * FROM user WHERE id = ?', [
        payload.id,
      ]);
      if (user.length === 0) {
        return sendResponse.authError(res, 'User not found');
      }
      if (user[0].roleFk !== 2) {
        return sendResponse.authError(res, 'Not an admin');
      }
      req.user = user[0];
      next();
    } catch (err) {
      catchError(err, res);
    }
  },
  catchErrorExport: async (err, res) => {
    catchError(err, res);
  },
};

const catchError = (err, res) => {
  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      error: 'jwt expired',
    });
  } else if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      error: 'Invalid token',
    });
  }
  if (err instanceof jwt.JsonWebTokenError) {
    sendResponse.authError(res, 'Token invalid');
    return;
  }
  sendResponse.error(res, err);
  return;
};

module.exports = Middleware;
