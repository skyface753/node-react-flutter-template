const db = require('./db');
const sendResponse = require('../helpers/sendResponse');

async function checkIfUsernameIsFree(username) {
  const result = await db.query('SELECT * FROM user WHERE username = ?', [
    username,
  ]);
  if (result.length > 0) {
    return false;
  }
  return true;
}

const UserService = {
  checkIfUsernameIsFree: async (req, res) => {
    const { username } = req.body;
    if (!username) {
      sendResponse.missingParams(res, 'username');
      return;
    }
    const isFree = await checkIfUsernameIsFree(username);
    if (isFree) {
      sendResponse.success(res, 'Username is free');
      return;
    }
    sendResponse.error(res, 'Username is taken');
  },
  changeUsername: async (req, res) => {
    const { username } = req.body;
    if (!username) {
      sendResponse.missingParams(res, 'username');
      return;
    }
    const isFree = await checkIfUsernameIsFree(username);
    if (!isFree) {
      sendResponse.error(res, 'Username is taken');
      return;
    }
    await db.query('UPDATE user SET username = ? WHERE id = ?', [
      username,
      req.user.id,
    ]);
    sendResponse.success(res, 'Username changed');
  },
  getSettings: async (req, res) => {
    const user = await db.query(
      'SELECT * FROM user LEFT JOIN user_2fa ON user_2fa.userFk = user.id LEFT JOIN avatar ON avatar.userFk = user.id WHERE id = ?',
      [req.user.id]
    );
    if (user.length === 0) {
      sendResponse.error(res, 'User not found');
      return;
    }
    sendResponse.success(res, {
      username: user[0].username,
      email: user[0].email,
      avatar: user[0].generatedPath,
      twoFactorEnabled: user[0].verified && user[0].secretBase32 ? true : false,
    });
  },
};

module.exports = UserService;
