import { handleUnaryCall, sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { IAuthServiceServer } from '../proto/auth_grpc_pb';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  StatusRequest,
  StatusResponse,
  User,
} from '../proto/auth_pb';
import * as redis from 'redis';
import { BCRYPT_ROUNDS, JWT_SECRET, REDIS } from '../config';
import { validateUsername } from '../helpers/validator';
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
    call: ServerUnaryCall<LoginRequest, LoginResponse>,
    callback: sendUnaryData<LoginResponse>
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
      const loginResponse = new LoginResponse();
      const thisUser = new User()
        .setId(user.id)
        .setUsername(user.username)
        .setRole(user.role);
      loginResponse.setUser(thisUser);
      // TODO: Tokens

      console.log('login');
      callback(null, new LoginResponse());
    } catch (err) {
      console.log(err);
      return callback(new Error('Server error'), null);
    }
  }
  refreshToken(
    call: ServerUnaryCall<RefreshTokenRequest, RefreshTokenResponse>,
    callback: sendUnaryData<RefreshTokenResponse>
  ): void {
    console.log('refreshToken');
    callback(null, new RefreshTokenResponse());
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
  register(
    call: ServerUnaryCall<RegisterRequest, RegisterResponse>,
    callback: sendUnaryData<RegisterResponse>
  ): void {
    console.log('register');
    callback(null, new RegisterResponse());
  }

  // status: handleUnaryCall<StatusRequest, StatusResponse>;
  status(
    call: ServerUnaryCall<StatusRequest, StatusResponse>,
    callback: sendUnaryData<StatusResponse>
  ): void {
    console.log('status');
    callback(null, new StatusResponse());
  }
}
