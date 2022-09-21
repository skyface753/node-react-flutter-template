// const csrf = require('csrf');
// var csrfProtect = csrf({ cookie: true });

// const csrf = require("csurf");

// Services
// const RoutesTestService = require('./services/routes-test.js'); // Test Routes Authenticated

// // Basic Routes (Not Authenticated)

// router.post('/test/anonym', RoutesTestService.anonymous); // Test Routes Not Authenticated

// /**
//  * @Middleware
//  * Set req.user if a cookie exists
//  * Applyed to all routes below
//  * No error when not logged in -> (req.user = false)
//  * Used by authUser and authAdmin
//  */
// // router.use(async (req, res, next) => {
// //   await Middleware.getUserIfCookieExists(req, res, next);
// // });

// // Routes for testing the authentication

// router.post('/test/userIfCookie', RoutesTestService.userIfCookie);

// // User Routes (Authenticated)

// router.post('/test/user', Middleware.authUser, RoutesTestService.user);

// // Admin Routes (Authenticated)
// router.post('/test', Middleware.authAdmin, RoutesTestService.admin);

module.exports = router;
