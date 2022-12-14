import { Request } from 'express';
import multer from 'multer';
import fs from 'fs';
import { AvatarDir } from '../services/files/avatar_service';
import { IUserFromCookieInRequest } from '../types/express-custom';
// MULTER
const avatarStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const path = AvatarDir + file.filename;
    fs.mkdirSync(path, { recursive: true });
    cb(null, AvatarDir);
  },
  filename: (req: IUserFromCookieInRequest, file: Express.Multer.File, cb) => {
    cb(
      null,
      req.user?.id + '_' + Date.now() + '.' + file.originalname.split('.').pop()
    );
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  },
});

export default uploadAvatar;
