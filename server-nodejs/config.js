const config = {
  SQLDB: {
    host: "localhost",
    user: "user",
    password: "password",
    database: "database",
  },
  NOSQLDB: {
    HOST: "localhost",
    PORT: 27017,
    DB: "database",
  },
  JWT_SECRET: "secret",
  BCRYPT_ROUNDS: 10,
  files: {
    avatarDir: "files/avatars/",
  },
};

module.exports = config;
