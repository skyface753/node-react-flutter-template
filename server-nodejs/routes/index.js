// Imports
const express = require('express');
const router = express.Router();

const auth = require('./auth');
const avatar = require('./avatar');
const docs = require('./docs');
const test = require('./test');
const user = require('./user');

// Routes
router.use('/auth', auth);
router.use('/avatar', avatar);
router.use('/docs', docs);
router.use('/test', test);
router.use('/user', user);

module.exports = router;
