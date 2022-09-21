// Imports
const express = require('express');
const router = express.Router();
const Middleware = require('./middleware');
const csrf = require('csrf');
var csrfProtect = csrf({ cookie: true });
const swaggerDocsObj = require('./swagger'); // Swagger docs
// const csrf = require("csurf");

// Services
const RoutesTestService = require('./services/routes-test.js'); // Test Routes Authenticated
const UserService = require('./services/user_service.js');
const AvatarService = require('./services/files/avatar_service.js');
const { uploadAvatar } = require('./helpers/multer');

// Basic Routes (Not Authenticated)
router.post('/logout', UserService.logout);
router.post('/login', UserService.login);
router.put('/register', UserService.register);
router.use('/docs', swaggerDocsObj.serve, swaggerDocsObj.setup);
router.post('/test/anonym', RoutesTestService.anonymous); // Test Routes Not Authenticated

/**
 * @Middleware
 * Set req.user if a cookie exists
 * Applyed to all routes below
 * No error when not logged in -> (req.user = false)
 * Used by authUser and authAdmin
 */
router.use(async (req, res, next) => {
  await Middleware.getUserIfCookieExists(req, res, next);
});

// Routes for testing the authentication
router.get('/user/status', UserService.status);
router.post('/test/userIfCookie', RoutesTestService.userIfCookie);

// User Routes (Authenticated)
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
router.post('/test/user', Middleware.authUser, RoutesTestService.user);

// Admin Routes (Authenticated)
router.post('/test/admin', Middleware.authAdmin, RoutesTestService.admin);

module.exports = router;
