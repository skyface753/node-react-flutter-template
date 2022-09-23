const db = require('./db');
const config = require('../config.json');
const bycrypt = require('bcrypt');
const sendResponse = require('../helpers/sendResponse');
const {
  validateEmail,
  validatePassword,
  validateUsername,
} = require('../helpers/validator');
const crypto = require('crypto');
var jwt = require('jsonwebtoken');
const redis = require('redis');
const middleware = require('../middleware');
const redisClient = redis.createClient({
  host: config.REDIS.host,
  port: config.REDIS.port,
});

redisClient.on('error', (err) => {
  console.log('Error ' + err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.connect();

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

const AuthService = {
  logout: async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return sendResponse.authError(res, 'No refresh token');
    }
    var tokenInRedis = await redisClient.get(refreshToken);
    if (!tokenInRedis) {
      return sendResponse.error(res, 'Invalid refresh token');
    }
    await redisClient.del(refreshToken);
    res.clearCookie('jwt');
    sendResponse.success(res, 'Logged out');
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      sendResponse.missingParams(res, 'Email or password missing');
      return;
    }
    if (!validateEmail(email)) {
      sendResponse.error(res, 'Invalid email');
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
      sendResponse.error(res, 'Credentials do not match');
      return;
    }
    onLoginSuccess(remoteIp);
    user = {
      id: user.id,
      username: user.username,
      email: user.email,
      roleFk: user.roleFk,
      avatar: user.generatedPath,
    };
    createAndSendTokens(req, res, user);
  },
  register: async (req, res) => {
    console.log('IN REGISTER');
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      sendResponse.missingParams(res, 'username, email or password');
      return;
    }
    // Check if user already exists
    let user = await db.query(
      'SELECT * FROM user WHERE username = ? OR email = ?',
      [username, email]
    );

    if (user.length > 0) {
      sendResponse.error(res, 'User already exists');
      return;
    }
    if (password.length < 8) {
      sendResponse.error(res, 'Password must be at least 8 characters long');
      return;
    }
    if (!validateEmail(email)) {
      sendResponse.error(res, 'Invalid email');
      return;
    }
    if (!validatePassword(password)) {
      sendResponse.error(res, 'Password is too weak');
      return;
    }
    if (!validateUsername(username)) {
      sendResponse.error(
        res,
        'Username - only letters, numbers, underscore and hyphen allowed (min 3, max 20)'
      );
      return;
    }
    // Hash password
    const hashedPassword = await bycrypt.hash(password, config.BCRYPT_ROUNDS);
    // Create user
    user = await db.query(
      'INSERT INTO user (username, email, password, roleFk) VALUES (?, ?, ?, 1)',
      [username, email, hashedPassword]
    );
    if (!user) {
      sendResponse.error(res, 'Could not create user');
      return;
    }
    user = {
      id: user.insertId,
      username,
      email,
      roleFk: 1,
      avatar: null,
    };

    createAndSendTokens(req, res, user);
  },

  refreshToken: async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      sendResponse.missingParams(res, 'refreshToken');
      return;
    }
    const token = await redisClient.get(refreshToken);
    if (!token) {
      return sendResponse.error(res, 'Invalid refresh token');
    }
    const user = JSON.parse(token);
    createAndSendTokens(req, res, user);
    // Delete refresh token
    await redisClient.del(refreshToken);
  },
  status: async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
      sendResponse.authError(res, 'No token');
      return;
    }
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      if (!decoded || !decoded.id) {
        sendResponse.authError(res, 'Invalid token');
        return;
      }
      const user = await db.query(
        'SELECT * FROM user LEFT JOIN avatar ON avatar.userFk = user.id WHERE id = ?',
        [decoded.id]
      );
      if (user.length === 0) {
        sendResponse.authError(res, 'User not found');
        return;
      }
      // console.log(user);
      const { id, username, email, roleFk, generatedPath } = user[0];
      sendResponse.success(res, {
        id,
        username,
        email,
        roleFk,
        avatar: generatedPath,
      });
    } catch (err) {
      middleware.catchErrorExport(err, res);
    }
  },
};

/**
 *
 * @param {
 *   id: number,
 *   username: string,
 *   email: string,
 *   roleFk: number
 *   avatar: string
 *  } user
 * @param {*} res
 */
async function createAndSendTokens(req, res, user) {
  if (!user || !user.id || !user.username || !user.email || !user.roleFk) {
    sendResponse.serverError(res, 'Could not create tokens - missing data');
    return;
  }
  // Create Access Token
  const accessToken = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    config.JWT_SECRET,
    {
      // 10 seconds
      expiresIn: 10,
    }
  );
  // Create Refresh Token
  const refreshToken = crypto.randomBytes(64).toString('hex');
  // Store refresh token in redis
  // console.log('refreshToken', refreshToken);
  await redisClient.set(
    refreshToken,
    JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email,
      roleFk: user.roleFk,
      avatar: user.generatedPath,
    })
  );
  await redisClient.expire(refreshToken, 60 * 60 * 24 * 7);
  const csrfToken = jwt.sign({ id: user.id }, config.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 7,
  });
  res.cookie('jwt', accessToken, {
    httpOnly: true,
    secure: process.env.MODE !== 'DEV',
    sameSite: 'strict',
    // Max age is 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  sendResponse.success(res, {
    accessToken,
    refreshToken,
    csrfToken,
    user,
  });
}

module.exports = AuthService;
