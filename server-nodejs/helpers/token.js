var jwt = require("jsonwebtoken");
const config = require("../config.json");
// jwt 30 Tage
const jwtExpirySeconds = 60 * 60 * 24 * 30;
const jwtKey = config.JWT_SECRET;

let tokenHelper = {
  sign: (user_id) => {
    return jwt.sign({ user_id }, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds,
    });
  },
  get: (req) => {
    const token = req.cookies.jwt;
    if (!token) {
      return false;
    }
    // console.log("Token: " + token);
    return token;
    // var token = req.headers.authorization;
    // if(token){
    //     console.log("Token: " + token);
    //     return token
    // }
    // if (!token) {
    //   if (req.cookies.jwt) {
    //     console.log("Token from cookie: " + req.cookies.jwt);
    //     token = req.cookies.jwt;
    //   } else {
    //     return false;
    //   }
    // }
    // console.log("Token from Header: " + token);
    // return token;
  },
  verify: (req) => {
    const token = tokenHelper.get(req);
    if (!token) {
      return false;
    }
    var payload;
    try {
      payload = jwt.verify(token, jwtKey);
    } catch (e) {
      return false;
    }
    var userId = payload.user_id;
    // console.log("Token from request: " + token);
    if (token) {
      return userId;
    } else {
      return false;
    }
  },
};

module.exports = tokenHelper;
