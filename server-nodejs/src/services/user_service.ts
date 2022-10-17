import db from './db';
import sendResponse from '../helpers/sendResponse';
import { Response } from 'express';
import { IUserFromCookieInRequest } from '../types/express-custom';

// async function checkIfUsernameIsFree(username: string) {
//   // const result = await db.query('SELECT * FROM user WHERE username = ?', [
//   // 	username,
//   // ]);
//   // if (result.length > 0) {
//   // 	return false;
//   // }
//   return true;
// }

const UserService = {
  // checkIfUsernameIsFree: async (req: Request, res: Response) => {
  //   const { username } = req.body;
  //   if (!username) {
  //     sendResponse.missingParams(res);
  //     return;
  //   }
  //   const isFree = await checkIfUsernameIsFree(username);
  //   if (isFree) {
  //     sendResponse.success(res, 'Username is free');
  //     return;
  //   }
  //   sendResponse.error(res);
  // },
  // changeUsername: async (req: IUserFromCookieInRequest, res: Response) => {
  //   const { username } = req.body;
  //   if (!username) {
  //     sendResponse.missingParams(res);
  //     return;
  //   }
  //   const isFree = await checkIfUsernameIsFree(username);
  //   if (!isFree) {
  //     sendResponse.error(res);
  //     return;
  //   }
  //   // await db.query('UPDATE user SET username = ? WHERE id = ?', [
  //   // 	username,
  //   // 	req.user?.id,
  //   // ]);
  //   // sendResponse.success(res, 'Username changed');
  // },
  getSettings: async (req: IUserFromCookieInRequest, res: Response) => {
    const user = await db.queryReplica(
      // 'SELECT * FROM user LEFT JOIN user_2fa ON user_2fa.userFk = user.id LEFT JOIN avatar ON avatar.userFk = user.id WHERE id = ?',
      'SELECT * FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user_2fa.userfk = testuser.user.id LEFT JOIN testuser.avatar ON testuser.avatar.userfk = testuser.user.id WHERE id = $1',
      [req.user?.id]
    );
    if (user.length === 0) {
      sendResponse.error(res);
      return;
    }
    sendResponse.success(res, {
      username: user[0].username,
      email: user[0].email,
      avatar: user[0].generatedpath,
      twoFactorEnabled: user[0].verified && user[0].secretbase32 ? true : false,
    });
  },
};

export default UserService;
