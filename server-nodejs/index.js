// Imports - EXT
var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var RateLimit = require('express-rate-limit');

// Variables
var app = express();
var port = 5000;

// CORS TODO: Change for Production
// app.use(cors()); // Development
app.use(
  // Production
  cors({
    origin: [
      'http://localhost:3000',
      // "http://localhost:19006",
    ],
    credentials: true,
  })
);

// set up rate limiter to prevent brute force attacks
var limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 400000, // TODO: Change for Production
});
app.use(limiter); //  apply to all requests

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Cookie Parser
app.use(cookieParser());

// Files
app.use('/files/avatars', express.static('files/avatars'));

// Routes
const routes = require('./routes');
app.use('/api/', routes);

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app; // For testing
