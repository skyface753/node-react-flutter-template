import { handleUnaryCall, sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { IAuthServiceServer } from '../proto/auth_grpc_pb';
import {
  LoginRequest,
  DefaultAuthResponse,
  RefreshTokenRequest,
  LogoutRequest,
  LogoutResponse,
  RegisterRequest,
  StatusRequest,
  StatusResponse,
  User,
  Role,
} from '../proto/auth_pb';
import * as redis from 'redis';
import { BCRYPT_ROUNDS, JWT_SECRET, REDIS } from '../config';
import { validatePassword, validateUsername } from '../helpers/validator';
import bycrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import db from './db';

// TODO Export
const redisClient = redis.createClient({
  url: ('redis://' + REDIS.host + ':' + REDIS.port).toString(),
});

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

export class AuthServer implements IAuthServiceServer {
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall;
  async login(
    call: ServerUnaryCall<LoginRequest, DefaultAuthResponse>,
    callback: sendUnaryData<DefaultAuthResponse>
  ): Promise<void> {
    // TODO: TOTP
    const { username, password, totpcode } = call.request.toObject();
    if (!username || username === '' || !password || password === '') {
      return callback(new Error('Missing username or password'), null);
    }
    if (!validateUsername(username)) {
      return callback(new Error('Invalid username'), null);
    }
    const remoteIp = call.getPeer();
    const f = failures[remoteIp];
    if (f && Date.now() < f.nextTry.getTime()) {
      return callback(new Error('Too many failed logins'), null);
    }
    const usersDB = await db.queryReplica(
      'SELECT * FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user_2fa.userFk = testuser.user.id LEFT JOIN testuser.avatar ON testuser.avatar.userFk = testuser.user.id WHERE LOWER(username) = LOWER($1)',
      [username.toLowerCase()]
    );
    if (!usersDB || usersDB.length === 0) {
      onLoginFail(remoteIp);
      return callback(new Error('Invalid username or password 1'), null);
    }
    const user = usersDB[0];
    try {
      const match = await bycrypt.compare(password, user.password);
      if (!match) {
        onLoginFail(remoteIp);
        return callback(new Error('Invalid username or password 2'), null);
      }
      if (user.secretbase32 && user.verified) {
        if (!totpcode) {
          return callback(new Error('2FA required'), null);
        }
        const verified = speakeasy.totp.verify({
          secret: user.secretbase32,
          encoding: 'base32',
          token: totpcode,
        });
        if (!verified) {
          return callback(new Error('Invalid 2FA code'), null);
        }
      }

      onLoginSuccess(remoteIp);
      // createAndSendTokens(res, user.id);
      const loginResponse = new DefaultAuthResponse();
      const role = user.rolefk === 2 ? Role.ADMIN : Role.USER;
      const thisUser = new User()
        .setId(user.id)
        .setUsername(user.username)
        .setRole(role);
      loginResponse.setUser(thisUser);
      createAndSendTokens(callback, user.id);
    } catch (err) {
      console.log(err);
      return callback(new Error('Server error'), null);
    }
  }

  async logout(
    call: ServerUnaryCall<LogoutRequest, LogoutResponse>,
    callback: sendUnaryData<LogoutResponse>
  ): Promise<void> {
    const { refreshToken } = call.request.toObject();
    if (!refreshToken || refreshToken === '') {
      return callback(new Error('No refresh token'), null);
    }
    const tokenInRedis = await redisClient.get(refreshToken);
    if (!tokenInRedis) {
      return callback(new Error('Invalid refresh token'), null);
    }
    await redisClient.del(refreshToken);
    callback(null, new LogoutResponse().setSuccess(true));
    // sendResponse.success(res, 'Logged out');

    // console.log('logout');
    // callback(null, new LogoutResponse());
  }
  async refreshToken(
    call: ServerUnaryCall<RefreshTokenRequest, DefaultAuthResponse>,
    callback: sendUnaryData<DefaultAuthResponse>
  ): Promise<void> {
    const { refreshToken } = call.request.toObject();

    console.log('refreshToken');
    if (!refreshToken || refreshToken === '') {
      return callback(new Error('No refresh token provieded'), null);
    }
    const token = await redisClient.get(refreshToken);
    if (!token) {
      return callback(new Error('Invalid refresh token'), null);
    }
    const userFromRedis = JSON.parse(token);
    const user = await db.queryReplica(
      'SELECT * FROM testuser.user WHERE id = $1',
      [userFromRedis.id]
    );
    if (user.length === 0) {
      return callback(new Error('User not found'), null);
    }
    delete user[0].password;
    createAndSendTokens(callback, user[0].id);
    // Delete refresh token
    await redisClient.del(refreshToken);
  }
  async register(
    call: ServerUnaryCall<RegisterRequest, DefaultAuthResponse>,
    callback: sendUnaryData<DefaultAuthResponse>
  ): Promise<void> {
    const { username, password } = call.request.toObject();
    if (!username || !password) {
      console.log('Missing : ', username, password);
      return callback(new Error('Missing username or password'), null);
    }
    // Check if user already exists
    const user = await db.queryReplica(
      'SELECT * FROM testuser.user WHERE LOWER(username) = LOWER($1)',
      [username]
    );
    if (user.length > 0) {
      return callback(new Error('User already exists'), null);
    }

    if (password.length < 8) {
      return callback(new Error('Password too short'), null);
    }

    if (!validatePassword(password) || !validateUsername(username)) {
      return callback(new Error('Invalid username or password'), null);
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
      return callback(new Error('Something went wrong'), null);
    }

    createAndSendTokens(callback, userId);
  }

  status(
    call: ServerUnaryCall<StatusRequest, StatusResponse>,
    callback: sendUnaryData<StatusResponse>
  ): void {
    console.log('status');
    callback(null, new StatusResponse());
  }
}

async function createAndSendTokens(callback: any, userId: number) {
  if (!userId) {
    return callback(new Error('Invalid user - Server error'), null);
  }
  const userDb = await db.queryPrimary(
    // Primary because backend is too fast for replicadb to update
    'SELECT * FROM testuser.user LEFT JOIN testuser.avatar ON avatar.userFk = testuser.user.id WHERE testuser.user.id = $1',
    [userId]
  );

  if (userDb.length === 0) {
    return callback(new Error('Invalid user - Server error'), null);
  }
  delete userDb[0].password;
  const role = userDb[0].rolefk === 2 ? Role.ADMIN : Role.USER;
  console.log('role', role, userDb[0].rolefk); // TODO: Avatar
  const user = new User()
    .setId(userDb[0].id)
    .setUsername(userDb[0].username)
    .setRole(role);
  // const user: User = new User(
  //   userDb[0].id,
  //   userDb[0].username,
  //   userDb[0].rolefk,
  //   userDb[0].generatedpath
  // );

  // Create Access Token
  const accessToken = jwt.sign(
    { id: user.getId(), username: user.getUsername() },
    JWT_SECRET,
    {
      // 10 minutes
      expiresIn: 10 * 60,
    }
  );
  // Create Refresh Token
  const refreshToken = crypto.randomBytes(64).toString('hex');
  // Store refresh token in redis
  await redisClient.set(refreshToken, JSON.stringify(user.toObject()));
  await redisClient.expire(refreshToken, 60 * 60 * 24 * 7);
  const csrfToken = jwt.sign({ id: user.getId() }, JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 7,
  });
  const loginResponse = new DefaultAuthResponse();
  loginResponse.setAccessToken(accessToken);
  loginResponse.setRefreshToken(refreshToken);
  loginResponse.setCsrfToken(csrfToken);
  loginResponse.setUser(user);
  callback(null, loginResponse);
}
