import sendResponse from '../../helpers/sendResponse';
import db from '../db';
import config from '../../config.json';
import fs from 'fs';
import { Request, Response } from 'express';
import { IUserFromCookieInRequest } from '../../types/express-custom';
interface MulterRequest extends Request {
  file: Express.Multer.File;
}

type Avatar = {
  generatedpath: string;
  originalname: string;
  type: string;
};

const AvatarService = {
  uploadAvatar: async (req: IUserFromCookieInRequest, res: Response) => {
    const file = (req as MulterRequest).file;
    if (!file) {
      sendResponse.missingParams(res);
      return;
    }
    const user = req.user;
    const originalname = file.originalname;
    const generatedpath = config.files.avatarDir + file.filename;
    const type = file.mimetype;

    const avatarExists = await db.queryReplica(
      'SELECT * FROM testuser.avatar WHERE testuser.avatar.userfk = $1',
      [user?.id]
    );
    let result;
    if (avatarExists.length > 0) {
      try {
        fs.unlinkSync(avatarExists[0].generatedpath);
      } catch (e) {
        console.log(e);
      }
      result = await db.queryPrimary(
        'UPDATE testuser.avatar SET originalname = $1, generatedpath = $2, type = $3 WHERE testuser.avatar.userfk = $4',
        [originalname, generatedpath, type, user?.id]
      );
    } else {
      result = await db.queryPrimary(
        'INSERT INTO testuser.avatar (originalname, generatedpath, type, userfk) VALUES ($1, $2, $3, $4)',
        [originalname, generatedpath, type, user?.id]
      );
    }
    if (!result) {
      sendResponse.error(res);
      return;
    }
    sendResponse.success(res, {
      message: 'Avatar uploaded',
      avatar: {
        originalname: originalname,
        generatedpath: generatedpath,
        type: type,
        userFk: user?.id,
      },
    });
  },
  deleteAvatar: async (req: IUserFromCookieInRequest, res: Response) => {
    const user = req.user;
    const avatarDb = (await db.queryReplica(
      'SELECT * FROM testuser.avatar WHERE testuser.avatar.userfk = $1',
      [user?.id]
    )) as Avatar[];
    if (avatarDb.length === 0) {
      sendResponse.error(res);
      return;
    }
    const avatar = avatarDb[0];
    const result = await db.queryPrimary(
      'DELETE FROM testuser.avatar WHERE testuser.avatar.userfk = $1',
      [user?.id]
    );
    if (!result) {
      sendResponse.error(res);
      return;
    }
    fs.unlink(avatar.generatedpath, (err) => {
      if (err) {
        console.log(err);
      }
    });
    sendResponse.success(res, {
      message: 'Avatar deleted',
    });
  },
};
export default AvatarService;
