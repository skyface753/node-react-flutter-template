import { Request } from 'express';
import multer from 'multer';
import config from '../config.json';
import { IUserFromCookieInRequest } from '../types/express-custom';
// MULTER
const avatarStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, config.files.avatarDir);
  },
  filename: (req: IUserFromCookieInRequest, file: Express.Multer.File, cb) => {
    cb(
      null,
      req.user?.id + '_' + Date.now() + '.' + file.originalname.split('.').pop()
    );
  },
});

const uploadAvatar = multer({ storage: avatarStorage });

export default uploadAvatar;
