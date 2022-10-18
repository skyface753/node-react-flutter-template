import db from './db';
import bycrypt from 'bcrypt';
import sendResponse from '../helpers/sendResponse';
import speakeasy from 'speakeasy';
import { validatePassword, validateUsername } from '../helpers/validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import * as redis from 'redis';
import middleware from '../middleware';
import { Request, Response } from 'express';
import { IUserFromCookieInRequest } from '../types/express-custom';
import { IAccessTokenPayload } from '../types/jwt-payload';
import { BCRYPT_ROUNDS, JWT_SECRET, REDIS } from '../config';

const redisClient = redis.createClient({
  url: ('redis://' + REDIS.host + ':' + REDIS.port).toString(),
  //   legacyMode: true,
});

// const redisClient = redis.createClient({
// 	config.REDIS_HOST: string,
// 	port: config.REDIS_PORT,
// 	password: config.REDIS_PASSWORD,
// });

// const redisClient = redis.createClient({
// 	host: config.REDIS.host,
// 	port: config.REDIS.port,
// });

redisClient.on('error', (err) => {
  console.log('Error ' + err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.connect();

// Prevent brute force attacks
const failures: { [key: string]: { count: number; nextTry: Date } } = {};
/**
 * Stores the login failure information in the session.
 * @param {string} remoteIp The remote IP address.
 */
function onLoginFail(remoteIp: string) {
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
function onLoginSuccess(remoteIp: string) {
  delete failures[remoteIp];
}

// Clean up people that have given up
const MINS10 = 600000;
const MINS30 = 3 * MINS10;
setInterval(function () {
  for (const ip in failures) {
    if (Date.now() - failures[ip].nextTry.getTime() > MINS30) {
      delete failures[ip];
    }
  }
}, MINS30);

type User2FA = {
  secretbase32: string;
  verified: boolean;
  id?: number;
  password?: string;
  username?: string;
};

const AuthService = {
  logout: async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    res.clearCookie('jwt');
    if (!refreshToken) {
      return sendResponse.authError(res);
    }
    const tokenInRedis = await redisClient.get(refreshToken);
    if (!tokenInRedis) {
      return sendResponse.error(res);
    }
    await redisClient.del(refreshToken);
    sendResponse.success(res, 'Logged out');
  },
  login: async (req: Request, res: Response) => {
    const { username, password, totpCode } = req.body;
    if (!username || !password) {
      sendResponse.missingParams(res);
      return;
    }
    if (!validateUsername(username)) {
      sendResponse.error(res);
      return;
    }
    const remoteIp = req.ip;
    const f = failures[remoteIp];
    if (f && Date.now() < f.nextTry.getTime()) {
      sendResponse.error(res);
      return;
    }

    const user = await db
      .queryReplica(
        'SELECT * FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user_2fa.userFk = testuser.user.id LEFT JOIN testuser.avatar ON testuser.avatar.userFk = testuser.user.id WHERE LOWER(username) = LOWER($1)',
        [username.toLowerCase()]
      )
      .then((result) => {
        if (result.length === 0) {
          onLoginFail(remoteIp);
          sendResponse.error(res);
          return;
        }
        return result[0];
      });

    const match = await bycrypt.compare(password, user.password);
    if (!match) {
      onLoginFail(remoteIp);
      sendResponse.error(res);
      return;
    }
    if (user.secretbase32 && user.verified) {
      if (!totpCode) {
        return res.status(400).send({
          success: false,
          message: '2FA required',
        });
      }
      const verified = speakeasy.totp.verify({
        secret: user.secretbase32,
        encoding: 'base32',
        token: totpCode,
      });
      if (!verified) {
        return sendResponse.error(res);
      }
    }

    onLoginSuccess(remoteIp);
    createAndSendTokens(res, user.id);
  },
  register: async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      console.log('Missing : ', username, password);
      sendResponse.missingParams(res);
      return;
    }
    // Check if user already exists
    const user = await db.queryReplica(
      'SELECT * FROM testuser.user WHERE LOWER(username) = LOWER($1)',
      [username]
    );
    if (user.length > 0) {
      sendResponse.error(res);
      return;
    }

    if (password.length < 8) {
      sendResponse.error(res);
      return;
    }

    if (!validatePassword(password) || !validateUsername(username)) {
      sendResponse.error(res);
      return;
    }

    // Hash password
    const hashedPassword = await bycrypt.hash(password, BCRYPT_ROUNDS);
    // Create user
    const userId = await db
      .queryPrimary(
        'INSERT INTO testuser.user (username, password, rolefk) VALUES ($1, $2, $3) RETURNING id',
        [username, hashedPassword, 1]
      )
      .then((result) => {
        return result[0].id;
      });
    if (!userId) {
      sendResponse.serverError(res);
      return;
    }

    createAndSendTokens(res, userId);
  },
  // Before verifying
  enable2FA: async (req: IUserFromCookieInRequest, res: Response) => {
    const { password } = req.body;
    const requestingUser = req.user;
    const username = requestingUser?.username;
    if (!username || !password) {
      console.log('Missing : ', username, password);
      sendResponse.missingParams(res);
      return;
    }
    // Check if user already has 2FA
    const userDB = (await db.queryReplica(
      'SELECT * FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user_2fa.userfk = testuser.user.id WHERE testuser.user.id = $1',
      [requestingUser?.id]
    )) as User2FA[];
    if (userDB.length === 0) {
      return sendResponse.error(res);
    }
    const user = userDB[0];
    if (user.secretbase32 && user.verified) {
      return sendResponse.error(res);
    } else if (user.secretbase32 && !user.verified) {
      console.log('User has 2FA but not verified - deleting and re-creating');
      await db.queryPrimary(
        'DELETE FROM testuser.user_2fa WHERE userfk = $1',

        [user.id]
      );
    }

    // Verify password
    const match = await bycrypt.compare(password, user.password as string);
    if (!match) {
      return sendResponse.error(res);
    }
    const MFA_Issuer = process.env.MFA_ISSUER || 'MyApp';
    const secret = speakeasy.generateSecret({
      otpauth_url: true,
      name: MFA_Issuer + ' (' + user.username + ')',
    });
    const url = secret.otpauth_url;
    const secretbase32 = secret.base32;
    const dbResult = await db.queryPrimary(
      'INSERT INTO testuser.user_2fa (userfk, secretbase32) VALUES ($1, $2)',
      [user.id, secretbase32]
    );
    if (!dbResult) {
      sendResponse.error(res);
      return;
    }
    sendResponse.success(res, {
      url,
      secretbase32,
    });
  },
  // After enabling
  verify2FA: async (req: IUserFromCookieInRequest, res: Response) => {
    const { currentCode } = req.body;
    const requestingUser = req.user;
    const username = requestingUser?.username;
    if (!username || !currentCode) {
      console.log('Missing : ', username, currentCode);
      return sendResponse.missingParams(res);
    }
    // Check if user already has 2FA

    const userDB = (await db.queryReplica(
      'SELECT * FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user_2fa.userFk = testuser.user.id WHERE LOWER(testuser.user.username) = LOWER($1)',
      [username]
    )) as User2FA[];
    if (userDB.length === 0) {
      return sendResponse.error(res);
    }
    // user = user[0];
    const user = userDB[0];
    if (!user.secretbase32) {
      return sendResponse.error(res);
    }
    if (user.verified) {
      return sendResponse.error(res);
    }
    const verified = speakeasy.totp.verify({
      secret: user.secretbase32,
      encoding: 'base32',
      token: currentCode,
    });
    if (!verified) {
      return sendResponse.error(res);
    }
    const dbResult = await db.queryPrimary(
      'UPDATE testuser.user_2fa SET verified = true WHERE userFk = $1',
      [user.id]
    );
    if (!dbResult) {
      sendResponse.error(res);
      return;
    }
    sendResponse.success(res, {
      message: '2FA verified',
    });
  },
  disable2FA: async (req: IUserFromCookieInRequest, res: Response) => {
    const { password, totpCode } = req.body;
    const requestingUser = req.user;
    const username = requestingUser?.username;
    if (!username || !password || !totpCode) {
      console.log('Missing : ', username, password, totpCode);
      return sendResponse.missingParams(res);
    }
    // Check if user already has 2FA
    const userDB = (await db.queryReplica(
      'SELECT * FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user_2fa.userFk = testuser.user.id WHERE testuser.user.id = $1',
      [requestingUser?.id]
    )) as User2FA[];

    if (userDB.length === 0) {
      return sendResponse.error(res);
    }
    const user = userDB[0];
    if (!user.secretbase32 || !user.verified) {
      return sendResponse.error(res);
    }
    // Verify password
    const match = await bycrypt.compare(password, user.password as string);
    if (!match) {
      return sendResponse.error(res);
    }
    // Verify 2FA
    const verified = speakeasy.totp.verify({
      secret: user.secretbase32,
      encoding: 'base32',
      token: totpCode,
    });
    if (!verified) {
      return sendResponse.error(res);
    }
    const dbResult = await db.queryPrimary(
      'DELETE FROM testuser.user_2fa WHERE userfk = $1',
      [user.id]
    );
    if (!dbResult) {
      return sendResponse.error(res);
    }
    sendResponse.success(res, {
      message: '2FA disabled',
    });
  },

  refreshToken: async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      sendResponse.missingParams(res);
      return;
    }
    const token = await redisClient.get(refreshToken);
    if (!token) {
      return sendResponse.error(res);
    }
    const userFromRedis = JSON.parse(token);
    const user = await db.queryReplica(
      'SELECT * FROM testuser.user WHERE id = $1',
      [userFromRedis.id]
    );
    if (user.length === 0) {
      return sendResponse.error(res);
    }
    delete user[0].password;
    createAndSendTokens(res, user[0].id);
    // Delete refresh token
    await redisClient.del(refreshToken);
  },
  status: async (req: Request, res: Response) => {
    let token = req.cookies.jwt || req.headers.authorization;

    if (!token) {
      sendResponse.authError(res);
      return;
    }
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length).trimLeft();
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as IAccessTokenPayload;
      if (!decoded || !decoded.id) {
        sendResponse.authError(res);
        return;
      }
      const user = await db.queryReplica(
        'SELECT * FROM testuser.user LEFT JOIN testuser.avatar ON testuser.avatar.userfk = testuser.user.id WHERE testuser.user.id = $1',
        [decoded.id]
      );
      if (user.length === 0) {
        sendResponse.authError(res);
        return;
      }
      // console.log(user);
      const { id, username, email, rolefk, generatedpath } = user[0];
      sendResponse.success(res, {
        id,
        username,
        email,
        rolefk,
        avatar: generatedpath,
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
 *   rolefk: number
 *   avatar: string
 *  } user
 * @param {*} res
 */
// interface User {
//   id: number;
//   username: string;
//   email: string;
//   rolefk: number;
//   generatedpath: string;
// }

class User {
  id: number;
  username: string;
  rolefk: number;
  avatar: string;
  constructor(
    id: number,
    username: string,
    rolefk: number,
    generatedpath: string
  ) {
    this.id = id;
    this.username = username;
    this.rolefk = rolefk;
    this.avatar = generatedpath;
  }
}

async function createAndSendTokens(res: Response, userId: number) {
  if (!userId) {
    return sendResponse.serverError(res);
  }
  const userDb = await db.queryPrimary(
    // Primary because backend is too fast for replicadb to update
    'SELECT * FROM testuser.user LEFT JOIN testuser.avatar ON avatar.userFk = testuser.user.id WHERE testuser.user.id = $1',
    [userId]
  );

  if (userDb.length === 0) {
    return sendResponse.serverError(res);
  }
  delete userDb[0].password;
  const user: User = new User(
    userDb[0].id,
    userDb[0].username,
    userDb[0].rolefk,
    userDb[0].generatedpath
  );

  // Create Access Token
  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    {
      // 10 minutes
      expiresIn: 10 * 60,
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
      rolefk: user.rolefk,
      avatar: user.avatar,
    })
  );
  await redisClient.expire(refreshToken, 60 * 60 * 24 * 7);
  const csrfToken = jwt.sign({ id: user.id }, JWT_SECRET, {
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
export default AuthService;
