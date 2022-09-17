// Imports
const express = require('express');
const router = express.Router();
const Middleware = require('./middleware');
// const csrf = require("csurf");

// Services
const RoutesTestService = require('./services/routes-test.js'); // Test Routes Authenticated
const UserService = require('./services/user_service.js');
const AvatarService = require('./services/files/avatar_service.js');
const { uploadAvatar } = require('./helpers/multer');

router.post('/logout', UserService.logout);
router.post('/login', UserService.login);
router.put('/register', UserService.register);

// Api-Docs
const swaggerDocsObj = require('./swagger');
router.use('/docs', swaggerDocsObj.serve, swaggerDocsObj.setup);

router.post('/test/anonym', RoutesTestService.anonymous);

// Set req.user if user is logged in
router.use(async (req, res, next) => {
  await Middleware.getUserIfCookieExists(req, res, next);
});

router.get('/user/status', UserService.status);

router.post('/test/userIfCookie', RoutesTestService.userIfCookie);

router.use(async (req, res, next) => {
  await Middleware.authUser(req, res, next);
});

router.put(
  '/files/avatar/upload',
  uploadAvatar.single('avatar'),
  AvatarService.uploadAvatar
);
router.delete('/files/avatar/delete', AvatarService.deleteAvatar);
router.post('/test/user', RoutesTestService.user);

router.use(async (req, res, next) => {
  await Middleware.authAdmin(req, res, next);
});

router.post('/test/admin', RoutesTestService.admin);

module.exports = router;
