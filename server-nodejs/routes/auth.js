// Imports
const express = require('express');
const router = express.Router();

const AuthService = require('../services/auth_service.js');

router.post('/logout', AuthService.logout);
router.post('/login', AuthService.login);
router.put('/register', AuthService.register);
router.get('/status', AuthService.status);
router.post('/refreshToken', AuthService.refreshToken);

module.exports = router;
