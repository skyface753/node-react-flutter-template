// Imports - EXT
var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var RateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
var cookieSession = require('cookie-session');
// Variables
var app = express();
var port = 5000;

// Reduce Fingerprinting
app.disable('x-powered-by');

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

// Helmet
app.use(helmet());

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

// set up the cookie for the session
app.use(
  cookieSession({
    name: 'session', // name of the cookie
    secret: 'MAKE_THIS_SECRET_SECURE', // key to encode session
    maxAge: 24 * 60 * 60 * 1000, // cookie's lifespan
    sameSite: 'lax', // controls when cookies are sent
    path: '/', // explicitly set this for security purposes
    secure: process.env.NODE_ENV === 'production', // cookie only sent on HTTPS
    httpOnly: true, // cookie is not available to JavaScript (client)
  })
);

app.use(morgan('combined'));

// Files
app.use('/files/avatars', express.static('files/avatars'));

// Routes
const routes = require('./routes/index');
app.use('/api/', routes);

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app; // For testing
