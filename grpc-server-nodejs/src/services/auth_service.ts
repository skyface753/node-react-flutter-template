import {
  Metadata,
  sendUnaryData,
  ServerUnaryCall,
  status,
} from '@grpc/grpc-js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { IAuthServiceServer } from '../proto/grpc-proto/auth_grpc_pb';
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
  EnableTOTPRequest,
  EnableTOTPResponse,
  VerifyTOTPRequest,
  VerifyTOTPResponse,
  DisableTOTPRequest,
  DisableTOTPResponse,
} from '../proto/grpc-proto/auth_pb';
import * as redis from 'redis';
import { BCRYPT_ROUNDS, JWT_SECRET, REDIS, ttl } from '../config';
import { validatePassword, validateUsername } from '../helpers/validator';
import bycrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import { prismaClient } from './db';
import { getAvatarUrl } from '../helpers/s3-helper';

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
    // const usersDB = await db.queryReplica(
    //   'SELECT * FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user_2fa.userFk = testuser.user.id LEFT JOIN testuser.avatar ON testuser.avatar.userFk = testuser.user.id WHERE LOWER(username) = LOWER($1)',
    //   [username.toLowerCase()]
    // );
    const user = await prismaClient.user.findFirst({
      where: {
        username: username.toLowerCase(),
      },
      include: {
        avatar: true,
        user_2fa: true,
      },
    });
    if (!user) {
      onLoginFail(remoteIp);
      return callback({
        code: status.NOT_FOUND,
        message: 'User not found',
      });
    }
    // if (!usersDB || usersDB.length === 0) {
    //   onLoginFail(remoteIp);
    //   return callback(new Error('Invalid username or password 1'), null);
    // }
    // const user = usersDB[0];
    try {
      const match = await bycrypt.compare(password, user.password);

      if (!match) {
        onLoginFail(remoteIp);
        return callback({
          message: 'Invalid password',
          code: status.UNAUTHENTICATED,
        })
      }
      if (user.user_2fa?.secretbase32 && user.user_2fa?.verified) {
        if (!totpcode) {
          return callback({
            code: status.UNAUTHENTICATED,
            message: 'TOTP code required',
          });
        }
        const verified = speakeasy.totp.verify({
          secret: user.user_2fa.secretbase32,
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
      // const role = user.rolefk === 1 ? Role.ADMIN : Role.USER;
      const thisUser = new User()
        .setId(user.id)
        .setUsername(user.username)
        .setRole(user.rolefk);
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
    console.log(tokenInRedis + ' ' + refreshToken);
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

    console.log('refreshToken', refreshToken);
    if (!refreshToken || refreshToken === '') {
      return callback(new Error('No refresh token provieded'), null);
    }
    const token = await redisClient.get(refreshToken);
    if (!token) {
      return callback(new Error('Invalid refresh token'), null);
    }
    const userFromRedis = JSON.parse(token);
    // const user = await db.queryReplica(
    //   'SELECT * FROM testuser.user WHERE id = $1',
    //   [userFromRedis.id]
    // );
    const user = await prismaClient.user.findFirst({
      where: {
        id: userFromRedis.id,
      },
    });
    if (!user) {
      return callback(new Error('User not found'), null);
    }
    // if (user.length === 0) {
    //   return callback(new Error('User not found'), null);
    // }
    createAndSendTokens(callback, user.id);
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
    // const user = await db.queryReplica(
    //   'SELECT * FROM testuser.user WHERE LOWER(username) = LOWER($1)',
    //   [username]
    // );
    const user = await prismaClient.user.findFirst({
      where: {
        username: username.toLowerCase(),
      },
    });
    if (user) {
      return callback(new Error('User already exists'), null);
    }
    // if (user.length > 0) {
    //   return callback(new Error('User already exists'), null);
    // }

    if (password.length < 8) {
      return callback(new Error('Password too short'), null);
    }

    if (!validatePassword(password) || !validateUsername(username)) {
      return callback(new Error('Invalid username or password'), null);
    }

    // Hash password
    const hashedPassword = await bycrypt.hash(password, BCRYPT_ROUNDS);
    // Create user
    // const userId = await db
    //   .queryPrimary(
    //     'INSERT INTO testuser.user (username, password, rolefk) VALUES ($1, $2, $3) RETURNING id',
    //     [username, hashedPassword, 1]
    //   )
    //   .then((result) => {
    //     return result[0].id;
    //   });
    const userId = await prismaClient.user
      .create({
        data: {
          username: username,
          password: hashedPassword,
          rolefk: Role.USER,
        },
      })
      .then((result) => {
        return result.id;
      });

    if (!userId) {
      return callback(new Error('Something went wrong'), null);
    }

    createAndSendTokens(callback, userId);
  }

  async enableTOTP(
    call: ServerUnaryCall<EnableTOTPRequest, EnableTOTPResponse>,
    callback: sendUnaryData<EnableTOTPResponse>
  ): Promise<void> {
    AuthServer.checkToken(call.metadata, false, callback).then(
      async (userReq: User | null) => {
        const { password } = call.request.toObject();

        // Check if user already has 2FA
        // const userDB = await db.queryReplica(
        //   'SELECT * FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user_2fa.userfk = testuser.user.id WHERE testuser.user.id = $1',
        //   [userReq?.getId()]
        // );
        const user = await prismaClient.user.findFirst({
          where: {
            id: userReq?.getId(),
          },
          include: {
            user_2fa: true,
          },
        });
        if (!user) {
          return callback(new Error('User not found'), null);
        }
        if (user?.user_2fa) {
          return callback(new Error('2FA already enabled'), null);
        }

        // if (userDB.length === 0) {
        //   return callback({
        //     code: status.NOT_FOUND,
        //     message: 'User not found',
        //   });
        // }
        // const user = userDB[0];

        // Verify password
        const match = await bycrypt.compare(password, user.password as string);
        if (!match) {
          return callback({
            code: status.UNAUTHENTICATED,
            message: 'Invalid password',
          });
        }
        if (user.user_2fa?.secretbase32 && user.user_2fa?.verified) {
          return callback({
            code: status.ALREADY_EXISTS,
            message: 'User already has 2FA enabled',
          });
        } else if (user.user_2fa?.secretbase32 && !user.user_2fa?.verified) {
          console.log(
            'User has 2FA but not verified - deleting and re-creating'
          );
          // await db.queryPrimary(
          //   'DELETE FROM testuser.user_2fa WHERE userfk = $1',
          //   [user.id]
          // );
          await prismaClient.user_2fa.delete({
            where: {
              userfk: user.id,
            },
          });
        }

        const MFA_Issuer = process.env.MFA_ISSUER || 'MyApp';
        const secret = speakeasy.generateSecret({
          otpauth_url: true,
          name: MFA_Issuer + ' (' + user.username + ')',
        });
        const url = secret.otpauth_url;
        const secretbase32 = secret.base32;
        // const dbResult = await db.queryPrimary(
        //   'INSERT INTO testuser.user_2fa (userfk, secretbase32) VALUES ($1, $2)',
        //   [user.id, secretbase32]
        // );
        const dbResult = await prismaClient.user_2fa.create({
          data: {
            userfk: user.id,
            secretbase32: secretbase32,
          },
        });

        if (!dbResult) {
          return callback({
            code: status.INTERNAL,
            message: 'Something went wrong',
          });
          // sendResponse.error(res);
          // return;
        }
        const enableTOTPResponse = new EnableTOTPResponse();
        enableTOTPResponse.setUrl(url);
        enableTOTPResponse.setSecret(secretbase32);
        callback(null, enableTOTPResponse);
        // sendResponse.success(res, {
        //   url,
        //   secretbase32,
        // });
      }
    );
  }

  async verifyTOTP(
    call: ServerUnaryCall<VerifyTOTPRequest, VerifyTOTPResponse>,
    callback: sendUnaryData<VerifyTOTPResponse>
  ): Promise<void> {
    AuthServer.checkToken(call.metadata, false, callback).then(
      async (userReq: User | null) => {
        const { totpcode } = call.request.toObject();
        if (!totpcode || totpcode.length === 0 || totpcode.length > 6) {
          return callback({
            code: status.INVALID_ARGUMENT,
            message: 'Invalid TOTP code',
          });
        }
        // Check if user already has 2FA

        // const userDB = (await db.queryReplica(
        //   'SELECT * FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user_2fa.userFk = testuser.user.id WHERE testuser.user.id = $1',
        //   [userReq?.getId()]
        // )) as any[];
        const user = await prismaClient.user.findFirst({
          where: {
            id: userReq?.getId(),
          },
          include: {
            user_2fa: true,
          },
        });
        if (!user) {
          return callback(new Error('User not found'), null);
        }
        if (!user?.user_2fa) {
          return callback({
            code: status.NOT_FOUND,
            message: '2FA not enabled',
          });
        }
        // if (userDB.length === 0) {
        //   return callback({
        //     code: status.NOT_FOUND,
        //     message: 'User not found',
        //   });
        // }
        // user = user[0];
        // const user = userDB[0];
        if (!user.user_2fa.secretbase32) {
          return callback({
            code: status.NOT_FOUND,
            message: 'User does not have 2FA enabled',
          });
        }
        if (user.user_2fa.verified) {
          return callback({
            code: status.ALREADY_EXISTS,
            message: 'User already has 2FA enabled',
          });
        }
        const verified = speakeasy.totp.verify({
          secret: user.user_2fa.secretbase32,
          encoding: 'base32',
          token: totpcode,
        });
        if (!verified) {
          return callback({
            code: status.UNAUTHENTICATED,
            message: 'Invalid TOTP code',
          });
        }
        // const dbResult = await db.queryPrimary(
        //   'UPDATE testuser.user_2fa SET verified = true WHERE userFk = $1',
        //   [user.id]
        // );
        const dbResult = await prismaClient.user_2fa.update({
          where: {
            userfk: user.id,
          },
          data: {
            verified: true,
          },
        });

        if (!dbResult) {
          return callback({
            code: status.INTERNAL,
            message: 'Something went wrong',
          });
        }
        const verifyTOTPResponse = new VerifyTOTPResponse();
        verifyTOTPResponse.setSuccess(true);
        callback(null, verifyTOTPResponse);
      }
    );
  }
  async disableTOTP(
    call: ServerUnaryCall<DisableTOTPRequest, DisableTOTPResponse>,
    callback: sendUnaryData<DisableTOTPResponse>
  ): Promise<void> {
    AuthServer.checkToken(call.metadata, false, callback).then(
      async (userReq: User | null) => {
        const { password, totpcode } = call.request.toObject();
        console.log(call.request.toObject());
        if (!totpcode || totpcode.length === 0 || totpcode.length > 6) {
          return callback({
            code: status.INVALID_ARGUMENT,
            message: 'Invalid TOTP code',
          });
        }
        // Check if user already has 2FA
        // const userDB = (await db.queryReplica(
        //   'SELECT * FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user_2fa.userFk = testuser.user.id WHERE testuser.user.id = $1',
        //   [userReq?.getId()]
        // )) as any[];
        const user = await prismaClient.user.findFirst({
          where: {
            id: userReq?.getId(),
          },
          include: {
            user_2fa: true,
          },
        });

        // if (userDB.length === 0) {
        //   return callback({
        //     code: status.NOT_FOUND,
        //     message: 'User not found',
        //   });
        // }
        if (!user) {
          return callback({
            code: status.NOT_FOUND,
            message: 'User not found',
          });
        }
        // const user = userDB[0];
        if (!user.user_2fa?.secretbase32 || !user.user_2fa?.verified) {
          return callback({
            code: status.NOT_FOUND,
            message: 'User does not have 2FA enabled',
          });
        }
        // Verify password
        const match = await bycrypt.compare(password, user.password as string);
        if (!match) {
          return callback({
            code: status.UNAUTHENTICATED,
            message: 'Invalid password',
          });
        }
        // Verify 2FA
        const verified = speakeasy.totp.verify({
          secret: user.user_2fa.secretbase32,
          encoding: 'base32',
          token: totpcode,
        });
        if (!verified) {
          return callback({
            code: status.UNAUTHENTICATED,
            message: 'Invalid TOTP code',
          });
        }
        // const dbResult = await db.queryPrimary(
        //   'DELETE FROM testuser.user_2fa WHERE userfk = $1',
        //   [user.id]
        // );
        const dbResult = await prismaClient.user_2fa.delete({
          where: {
            userfk: user.id,
          },
        });

        if (!dbResult) {
          return callback({
            code: status.INTERNAL,
            message: 'Something went wrong',
          });
        }
        const disableTOTPResponse = new DisableTOTPResponse();
        disableTOTPResponse.setSuccess(true);
        callback(null, disableTOTPResponse);
      }
    );
  }

  status(
    call: ServerUnaryCall<StatusRequest, StatusResponse>,
    callback: sendUnaryData<StatusResponse>
  ): void {
    AuthServer.checkToken(call.metadata, false, callback).then(
      async (user: User | null) => {
        if (!user) {
          return callback({
            code: status.NOT_FOUND,
            message: 'User not found',
          });
        } else {
          const statusResponse = new StatusResponse();

          // TOTP Status & avatar (SELECT * FROM testuser.avatar WHERE userfk = $1)
          // const userDB = (await db.queryReplica(
          //   'SELECT * FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user_2fa.userFk = testuser.user.id LEFT JOIN testuser.avatar ON testuser.avatar.userfk = testuser.user.id WHERE testuser.user.id = $1',
          //   [user.getId()]
          // )) as any[];
          const userDB = await prismaClient.user.findFirst({
            where: {
              id: user.getId(),
            },
            include: {
              user_2fa: true,
              avatar: true,
            },
          });

          //   'SELECT * FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user_2fa.userFk = testuser.user.id WHERE testuser.user.id = $1',
          //   [user.getId()]
          // )) as unknown as any[];
          // console.log(userDB);
          // if (userDB.length === 0) {
          //   return callback({
          //     code: status.NOT_FOUND,
          //     message: 'User not found',
          //   });
          // }
          if (!userDB) {
            return callback({
              code: status.NOT_FOUND,
              message: 'User not found',
            });
          }
          if (userDB.avatar?.generatedpath) {
            const avatarUrl = await getAvatarUrl(userDB.avatar.generatedpath);
            console.log('AVATAR', avatarUrl);
            user.setAvatar(avatarUrl);
          }
          statusResponse.setUser(user);
          // const user2FA = userDB[0];
          if (userDB.user_2fa?.secretbase32 && userDB.user_2fa?.verified) {
            statusResponse.setTotpenabled(true);
          } else {
            statusResponse.setTotpenabled(false);
          }
          callback(null, statusResponse);
        }
      }
    );
  }

  static async checkToken(
    metadata: Metadata,
    checkForAdmin = false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: any
  ): Promise<User | null> {
    try {
      // Bearer token
      let token = metadata.get('authorization')[0];

      if (!token) {
        callback({
          code: status.UNAUTHENTICATED,
          message: 'No token provided',
        });
      }
      if (token.toString().startsWith('Bearer ')) {
        token = token.slice(7, token.length);
      }
      const payload = jwt.verify(
        token.toString(),
        JWT_SECRET
      ) as unknown as User.AsObject;
      console.log(payload);
      if (checkForAdmin && payload.role !== Role.ADMIN) {
        callback({
          code: status.PERMISSION_DENIED,
          message: 'Admin only',
        });
      }
      const user = new User();
      user.setId(payload.id);
      user.setUsername(payload.username);
      user.setRole(payload.role);
      return user;
    } catch (err) {
      console.trace(err);
      callback({
        code: status.UNAUTHENTICATED,
        message: 'Invalid token',
      });
      return null;
    }

    // const user = await redisClient.get(token);
    // if (!user) {
    //   throw new Error('Invalid token');
    // }
    // const userFromRedis = JSON.parse(user);
    // if (checkForAdmin && userFromRedis.role !== Role.ADMIN) {
    //   throw new Error('Not authorized');
    // }
    // return userFromRedis;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createAndSendTokens(callback: any, userId: number) {
  if (!userId) {
    return callback(new Error('Invalid user - Server error'), null);
  }
  // const userDb = await db.queryPrimary(
  //   // Primary because backend is too fast for replicadb to update
  //   'SELECT * FROM testuser.user LEFT JOIN testuser.avatar ON avatar.userFk = testuser.user.id WHERE testuser.user.id = $1',
  //   [userId]
  // );
  const userDb = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      avatar: true,
    },
  });

  if (!userDb) {
    return callback(new Error('Invalid user - Server error'), null);
  }

  // delete userDb[0].password;
  // delete userDb.password;

  // const role = userDb[0].rolefk === 2 ? Role.ADMIN : Role.USER;
  // console.log('role', role, userDb[0].rolefk); // TODO: Avatar

  const user = new User()
    .setId(userDb.id)
    .setUsername(userDb.username)
    .setRole(userDb.rolefk);
  if (userDb.avatar?.generatedpath) {
    const avatarUrl = await getAvatarUrl(userDb.avatar.generatedpath);
    user.setAvatar(avatarUrl);
  }
  // const user: User = new User(
  //   userDb[0].id,
  //   userDb[0].username,
  //   userDb[0].rolefk,
  //   userDb[0].generatedpath
  // );

  // Create Access Token
  const accessToken = jwt.sign(
    user.toObject(),
    // { id: user.getId(), username: user.getUsername() },
    JWT_SECRET,
    {
      // 10 minutes
      expiresIn: ttl,
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
