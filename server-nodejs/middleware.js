const sendResponse = require("./helpers/sendResponse");
const tokenHelper = require("./helpers/token");
const db = require("./services/db.js");

const Middleware = {
  getUserIfCookieExists: async (req, res, next) => {
    var userId = tokenHelper.verify(req);
    if (!userId) {
      next();
    } else {
      var user = await db.query("SELECT * FROM user WHERE id = ?", [userId]);
      req.user = user[0];
      console.log("User found in cookie: " + user[0].email);
      next();
    }
  },
  authUser: async (req, res, next) => {
    var userId = tokenHelper.verify(req);
    if (!userId) {
      sendResponse.authError(res, {
        message: "Unauthorized",
      });
      return;
    }
    var user = await db.query("SELECT * FROM user WHERE id = ?", [userId]);
    req.user = user[0];
    next();
  },
  authAdmin: async (req, res, next) => {
    var userId = tokenHelper.verify(req);
    if (!userId) {
      sendResponse.authError(res, {
        message: "Unauthorized",
      });
      return;
    }
    var user = await db.query("SELECT * FROM user WHERE id = ?", [userId]);
    if (user[0].roleFk != 2) {
      sendResponse.authAdminError(res, {
        message: "Unauthorized - Admin only",
        yourRole: user.roleFk,
      });
      return;
    }
    req.user = user[0];
    next();
  },
};

module.exports = Middleware;
