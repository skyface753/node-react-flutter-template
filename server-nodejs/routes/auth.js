// Imports
const express = require('express');
const router = express.Router();

const UserService = require('../services/auth_service.js');

router.post('/logout', UserService.logout);
router.post('/login', UserService.login);
router.put('/register', UserService.register);
router.get('/status', UserService.status);
router.post('/refreshToken', UserService.refreshToken);

module.exports = router;
