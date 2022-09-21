const db = require('./db');
const tokenHelper = require('../helpers/token');
const config = require('../config.json');
const bycrypt = require('bcrypt');
const sendResponse = require('../helpers/sendResponse');
const { validateEmail, validatePassword } = require('../helpers/validator');
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

// const redisHelper = {
//   setToken: (token, userId) => {
//     return new Promise((resolve, reject) => {
//       redisClient.set(token, userId, (err, reply) => {
//         if (err) {
//           reject(err);
//         }
//         resolve(reply);
//       });
//     });
//   },
//   checkTokenInRedis: (token) => {
//     return new Promise((resolve, reject) => {
//       redisClient.get(token, (err, reply) => {
//         if (err) {
//           reject(err);
//         }
//         resolve(reply);
//       });
//     });
//   },
// };

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
  logout: async (req, res) => {
    const token = tokenHelper.get(req);
    req.session = null;
    console.log('logout', token);
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
      email: user.email,
      roleFk: user.roleFk,
      avatar: user.generatedPath,
    };
    createAndSendTokens(user, res);
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
    if (password.length < 8) {
      sendResponse.error(res, 'Password must be at least 8 characters long');
      return;
    }
    if (!validateEmail(email)) {
      sendResponse.error(res, 'Invalid email');
      return;
    }
    if (!validatePassword(password)) {
      sendResponse.error(res, 'Invalid password');
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
    user = {
      id: user.insertId,
      email,
      roleFk: 1,
      avatar: null,
    };

    createAndSendTokens(user, res);
  },

  refreshToken: async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      sendResponse.missingParams(res, 'refreshToken');
      return;
    }
    const token = await redisClient.get(refreshToken);
    if (!token) {
      sendResponse.authError(res, 'Invalid refresh token');
      return;
    }
    const user = JSON.parse(token);
    createAndSendTokens(user, res);
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
      console.log(user);
      const { id, email, roleFk, generatedPath } = user[0];
      sendResponse.success(res, {
        id,
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
 *   email: string,
 *   roleFk: number
 *   avatar: string
 *  } user
 * @param {*} res
 */
async function createAndSendTokens(user, res) {
  // Create Access Token
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    config.JWT_SECRET,
    {
      // 10 seconds
      expiresIn: 10,
    }
  );
  // Create Refresh Token
  const refreshToken = crypto.randomBytes(64).toString('hex');
  // Store refresh token in redis
  console.log('refreshToken', refreshToken);
  await redisClient.set(
    refreshToken,
    JSON.stringify({
      id: user.id,
      email: user.email,
      roleFk: user.roleFk,
      avatar: user.generatedPath,
    })
  );
  await redisClient.expire(refreshToken, 60 * 60 * 24 * 7);
  res.cookie('jwt', accessToken, {
    httpOnly: true,
    // secure: true,
    sameSite: 'strict',
    // Max age is 30 minute
    maxAge: 1000 * 60 * 30,
  });
  sendResponse.success(res, {
    accessToken,
    refreshToken,
    user,
  });
}

module.exports = UserService;
