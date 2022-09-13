const sendResponse = require('../helpers/sendResponse');

const RoutesTestService = {
  anonymous: async (req, res) => {
    sendResponse.success(res, {
      message: 'Anonymous',
      user: req.user,
    });
  },
  userIfCookie: async (req, res) => {
    sendResponse.success(res, {
      message: 'User if Cookie',
      user: req.user ? req.user : 'No user',
    });
  },
  user: async (req, res) => {
    sendResponse.success(res, {
      message: 'User',
      user: req.user,
    });
  },
  admin: async (req, res) => {
    sendResponse.success(res, {
      message: 'Admin',
      user: req.user,
    });
  },
};

module.exports = RoutesTestService;
