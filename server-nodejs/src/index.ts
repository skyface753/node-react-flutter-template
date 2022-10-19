// Imports - EXT
// var express = require("express");
// var cors = require("cors");
// var cookieParser = require("cookie-parser");
// var bodyParser = require("body-parser");
// var RateLimit = require("express-rate-limit");
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import RateLimit from 'express-rate-limit';
import helmet from 'helmet';
// import
// const helmet = require("helmet");
// const morgan = require("morgan");
import morgan from 'morgan';
import db from './services/db';
db.initDb();
// var cookieSession = require('cookie-session');
// Variables
const app = express();
const port = 5000;

// Reduce Fingerprinting
app.disable('x-powered-by');

// CORS TODO: Change for Production

app.use(
  // Production
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000', // React debug as default
    ],
    credentials: true,
  })
);

// Helmet
app.use(
  helmet({
    // crossOriginResourcePolicy: process.env.MODE !== 'DEV',

    crossOriginResourcePolicy:
      process.env.MODE !== 'DEV'
        ? {
            policy: 'same-site',
          }
        : false,
  })
);

// set up rate limiter to prevent brute force attacks
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.MODE == 'DEV' ? 400000 : 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter); //  apply to all requests

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Cookie Parser
app.use(cookieParser());

// set up the cookie for the session
// app.use(
//   cookieSession({
//     name: 'session', // name of the cookie
//     secret: config.CSRF_SESSION_SECRET, // key to encode session
//     maxAge: 24 * 60 * 60 * 1000, // cookie's lifespan -> 1 day
//     sameSite: 'lax', // controls when cookies are sent
//     path: '/', // explicitly set this for security purposes
//     secure: process.env.MODE !== 'DEV', // cookie only sent on HTTPS
//     httpOnly: true, // cookie is not available to JavaScript (client)
//   })
// );
if (process.env.MODE !== 'Test') {
  app.use(morgan('combined'));
}

// Files
app.use('/files/avatars', express.static('files/avatars'));

// Routes
// const routes = require("./routes/index");
import routes from './routes/index';
app.use('/api/', routes);

// Start Server
if (process.env.MODE !== 'Test') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
