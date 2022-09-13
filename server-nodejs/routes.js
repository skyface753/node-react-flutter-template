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
const db = require('./services/db.js');

router.post('/logout', UserService.logout);
router.post('/login', UserService.login);
router.put('/register', UserService.register);

// Docs
const swaggerDocsObj = require('./swagger');

router.use('/docs', swaggerDocsObj.serve, swaggerDocsObj.setup);
// router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.post('/db/show', db.showTables);

router.post('/test/anonym', RoutesTestService.anonymous);

// Set req.user to logged in user if user is logged in
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
