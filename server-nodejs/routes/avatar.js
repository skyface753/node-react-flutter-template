// Imports
const express = require('express');
const router = express.Router();
const Middleware = require('../middleware');

const AvatarService = require('../services/files/avatar_service.js');
const { uploadAvatar } = require('../helpers/multer');

router.put(
  '/files/avatar/upload',
  Middleware.authUser,
  uploadAvatar.single('avatar'),
  AvatarService.uploadAvatar
);
router.delete(
  '/files/avatar/delete',
  Middleware.authUser,
  AvatarService.deleteAvatar
);

module.exports = router;
