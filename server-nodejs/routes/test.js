// Imports
const express = require('express');
const Middleware = require('../middleware.js');
const router = express.Router();

const RoutesTestService = require('../services/routes-test.js'); // Test Routes Authenticated

router.post('/anonym', RoutesTestService.anonymous); // Test Routes Not Authenticated
router.post('/user', Middleware.authUser, RoutesTestService.user);
router.post('/admin', Middleware.authAdmin, RoutesTestService.admin);

module.exports = router;
