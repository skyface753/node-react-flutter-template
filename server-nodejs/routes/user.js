// Imports
const express = require('express');
const router = express.Router();

const UserService = require('../services/user_service.js');
const Middleware = require('../middleware.js');

router.get('/username/isFree', UserService.checkIfUsernameIsFree);
router.put(
  '/username/update',
  Middleware.authUser,
  Middleware.csrfValidation,
  UserService.changeUsername
);
router.get(
  '/settings',
  Middleware.authUser,
  Middleware.csrfValidation,
  UserService.getSettings
);

module.exports = router;
