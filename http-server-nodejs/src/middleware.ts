import { Response, NextFunction } from 'express';
import sendResponse from './helpers/sendResponse';
import db from './services/db';
import jwt from 'jsonwebtoken';
import { IUserFromCookieInRequest } from './types/express-custom';
import { IAccessTokenPayload } from './types/jwt-payload';
import { JWT_SECRET } from './config';

export default {
  // const Middlewargcce = {
  authUser: async (
    req: IUserFromCookieInRequest,
    res: Response,
    next: NextFunction
  ) => {
    //Token from cookie or Barer
    let token = req.cookies.jwt || req.headers.authorization;

    if (!token) {
      console.log('No token');
      return sendResponse.authError(res);
    }
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET) as IAccessTokenPayload;
      if (!payload) {
        console.log('No payload');
        return sendResponse.authError(res);
      }
      const user = await db.queryReplica(
        'SELECT * FROM testuser.user WHERE id = $1',

        [payload.id]
      );
      if (user.length === 0) {
        console.log('No user');
        return sendResponse.authError(res);
      }
      req.user = user[0];
      next();
    } catch (err) {
      catchError(err, res);
    }
  },
  authAdmin: async (
    req: IUserFromCookieInRequest,
    res: Response,
    next: NextFunction
  ) => {
    let token = req.cookies.jwt || req.headers.authorization;

    if (!token) {
      return sendResponse.authError(res);
    }
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET) as IAccessTokenPayload;
      if (!payload) {
        return sendResponse.authError(res);
      }
      const user = await db.queryReplica(
        'SELECT * FROM testuser.user WHERE id = $1',
        [payload.id]
      );
      if (user.length === 0) {
        return sendResponse.authError(res);
      }
      if (user[0].rolefk !== 2) {
        return sendResponse.authAdminError(res);
      }
      req.user = user[0];
      next();
    } catch (err) {
      catchError(err, res);
    }
  },
  catchErrorExport: async (err: unknown, res: Response) => {
    catchError(err, res);
  },
  csrfValidation: async (
    req: IUserFromCookieInRequest,
    res: Response,
    next: NextFunction
  ) => {
    const csrfTokenInHeader = req.headers['x-csrf-token'] as string;
    try {
      if (!csrfTokenInHeader) {
        return sendResponse.authError(res);
      }
      const payload = jwt.verify(csrfTokenInHeader, JWT_SECRET);
      if (!payload) {
        return sendResponse.authError(res);
      }

      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return sendResponse.authError(res);
      } else if (err instanceof jwt.JsonWebTokenError) {
        return sendResponse.authError(res);
      }
      return sendResponse.serverError(res);
    }
  },
};

const catchError = (err: unknown, res: Response) => {
  if (err instanceof jwt.TokenExpiredError) {
    console.log('Token expired');
    return sendResponse.expiredToken(res);
  } else if (err instanceof jwt.JsonWebTokenError) {
    console.log('JsonWebTokenError');
    return sendResponse.authError(res);
  }
  if (err instanceof jwt.JsonWebTokenError) {
    console.log('JsonWebTokenError');
    sendResponse.authError(res);
    return;
  }
  console.log('Server error');
  sendResponse.serverError(res);
  return;
};
