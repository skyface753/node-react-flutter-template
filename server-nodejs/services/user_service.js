const db = require('./db');
const tokenHelper = require('../helpers/token');
const config = require('../config.json');
const bycrypt = require('bcrypt');
const sendResponse = require('../helpers/sendResponse');

// Prevent brute force attacks
const failures = {};
/**
 * Stores the login failure information in the session.
 * @param {string} remoteIp The remote IP address.
 */
function onLoginFail(remoteIp) {
  const f = (failures[remoteIp] = failures[remoteIp] || {
    count: 0,
    nextTry: new Date(),
  });
  ++f.count;
  if (f.count % 3 == 0) {
    f.nextTry.setTime(Date.now() + 1000 * 60 * 1); // 2 minutes
  }
}

/**
 * Remove the login failure information from the session.
 * @param {string} remoteIp The remote IP address.
 */
function onLoginSuccess(remoteIp) {
  delete failures[remoteIp];
}

// Clean up people that have given up
const MINS10 = 600000;
const MINS30 = 3 * MINS10;
setInterval(function () {
  for (const ip in failures) {
    if (Date.now() - failures[ip].nextTry > MINS10) {
      delete failures[ip];
    }
  }
}, MINS30);

const UserService = {
  logout: (req, res) => {
    res.clearCookie('jwt');
    sendResponse.success(res, 'Logged out');
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      sendResponse.missingParams(res, 'email or password');
      return;
    }
    const remoteIp = req.ip;
    const f = failures[remoteIp];
    if (f && Date.now() < f.nextTry) {
      sendResponse.error(
        res,
        'Too many failed attempts. Please try again later.'
      );
      return;
    }
    let user = await db.query(
      'SELECT * FROM user LEFT JOIN avatar ON avatar.userFk = user.id WHERE email = ?',
      [email]
    );
    if (user.length === 0) {
      onLoginFail(remoteIp);
      sendResponse.error(res, 'User not found');
      return;
    }
    user = user[0];
    const match = await bycrypt.compare(password, user.password);
    if (!match) {
      onLoginFail(remoteIp);
      sendResponse.error(res, 'Wrong password');
      return;
    }
    onLoginSuccess(remoteIp);
    const token = tokenHelper.sign(user.id);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'Strict',
    });

    sendResponse.success(res, {
      token: token,
      user: {
        id: user.id,
        email: user.email,
        roleFk: user.roleFk,
        avatarPath: user.generatedPath,
      },
    });
  },
  register: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      sendResponse.missingParams(res, 'email or password');
      return;
    }
    // Check if user already exists
    let user = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    if (user.length > 0) {
      sendResponse.error(res, 'User already exists');
      return;
    }
    // Hash password
    const hashedPassword = await bycrypt.hash(password, config.BCRYPT_ROUNDS);
    // Create user
    user = await db.query(
      'INSERT INTO user (email, password, roleFk) VALUES (?, ?, 1)',
      [email, hashedPassword]
    );
    if (!user) {
      sendResponse.error(res, 'Could not create user');
      return;
    }
    const token = tokenHelper.sign(user.insertId);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'Strict',
    });
    sendResponse.success(res, {
      token: token,
      user: {
        id: user.insertId,
        email: email,
        roleFk: 1,
      },
    });
  },
  status: async (req, res) => {
    const userFromCookie = req.user;
    if (!userFromCookie) {
      sendResponse.authError(res, 'Not logged in');
      return;
    }
    const user = await db.query('SELECT * FROM user  WHERE user.id = ?', [
      userFromCookie.id,
    ]);
    if (user.length === 0) {
      sendResponse.authError(res, 'User not found');
      return;
    }
    sendResponse.success(res, {
      user: {
        id: user[0].id,
        email: user[0].email,
        roleFk: user[0].roleFk,
      },
    });
  },
};

module.exports = UserService;
