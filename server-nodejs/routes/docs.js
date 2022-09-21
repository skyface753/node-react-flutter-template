// Imports
const express = require('express');
const router = express.Router();

const swaggerDocsObj = require('../swagger'); // Swagger docs
router.use('/docs', swaggerDocsObj.serve, swaggerDocsObj.setup);

module.exports = router;
