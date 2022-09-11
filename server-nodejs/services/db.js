const mysql = require("mysql2/promise");
const config = require("../config");

// var retryCounter = 0;
async function query(sql, params) {
  try {
    if (process.env.SQLDEBUG == "true") {
      console.log("SQL Query: " + sql);
      console.log("SQL Params: " + JSON.stringify(params));
      console.log("DB CONFIG: " + JSON.stringify(config.SQLDB));
    }
    const connection = await mysql.createConnection(config.SQLDB);
    const [results] = await connection.execute(sql, params);
    connection.end();
    return results;
  } catch (error) {
    console.log("SQL ERROR: " + error);
    return false;
  }
}

async function showTables(req, res) {
  try {
    const connection = await mysql.createConnection(config.SQLDB);
    const [results] = await connection.execute("SHOW TABLES");

    // Show Create command
    for (let i = 0; i < results.length; i++) {
      const [table] = await connection.execute(
        "SHOW CREATE TABLE " + results[i].Tables_in_database
      );
      console.log(table[0]["Create Table"]);
    }
    connection.end();
    res.send({
      message: "Tables shown",
    });
  } catch (error) {
    console.log("SQL ERROR: " + error);
    return false;
  }
}

module.exports = {
  query,
  showTables,
};
//  initDb();
async function initDb() {
  // Create Tables
  const avatar =
    "CREATE TABLE IF NOT EXISTS `avatar` (`userFk` int(11) NOT NULL, `originalName` varchar(250) NOT NULL, `generatedPath` varchar(250) NOT NULL, `type` varchar(50) NOT NULL, PRIMARY KEY (`userFk`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
  const role =
    "CREATE TABLE IF NOT EXISTS `role` ( `id` int(11) NOT NULL AUTO_INCREMENT, `title` varchar(50) NOT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4";
  const user =
    "CREATE TABLE IF NOT EXISTS `user` (`id` int(11) NOT NULL AUTO_INCREMENT,`email` varchar(100) NOT NULL,`password` varchar(250) NOT NULL,`roleFk` int(11) NOT NULL DEFAULT 1, PRIMARY KEY (`id`), KEY `role_fk` (`roleFk`), CONSTRAINT `role_fk` FOREIGN KEY (`roleFk`) REFERENCES `role` (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4";
  var avatarResult = await query(avatar, []);
  var roleResult = await query(role, []);
  var userResult = await query(user, []);
  if (process.env.SQLDEBUG == "true") {
    console.log("Avatar Result: " + JSON.stringify(avatarResult));
    console.log("Role Result: " + JSON.stringify(roleResult));
    console.log("User Result: " + JSON.stringify(userResult));
  }
  if (
    avatarResult.affectedRows == 0 &&
    roleResult.affectedRows == 0 &&
    userResult.affectedRows == 0
  ) {
    console.log("SQL Tables already exist - no need to create");
    return;
  }

  // Create indices
  const userPrimary = "ALTER TABLE `user` ADD PRIMARY KEY (`id`)";
  const userMail = "ALTER TABLE `user` ADD UNIQUE KEY `email` (`email`)";
  const userRole = "ALTER TABLE `user` ADD KEY `role_fk` (`roleFk`)";
  const userRoleFk =
    "ALTER TABLE `user` ADD CONSTRAINT `role_fk` FOREIGN KEY (`roleFk`) REFERENCES `role` (`id`)";
  query(userPrimary, []);
  query(userMail, []);
  query(userRole, []);
  query(userRoleFk, []);
  const avatarPrimary = "ALTER TABLE `avatar` ADD PRIMARY KEY (`userFk`)";
  const avatarUserFk =
    "ALTER TABLE `avatar` ADD CONSTRAINT `user_fk` FOREIGN KEY (`userFk`) REFERENCES `user` (`id`)";
  query(avatarPrimary, []);
  query(avatarUserFk, []);

  // Insert Roles
  const roleUser = "INSERT INTO `role` (`id`, `title`) VALUES (1, 'user')";
  const roleAdmin = "INSERT INTO `role` (`id`, `title`) VALUES (2, 'admin')";
  query(roleUser, []);
  query(roleAdmin, []);

  // Insert Admin
  const admin =
    "INSERT INTO `user` (`id`, `email`, `password`, `roleFk`) VALUES (1, 'admin@example.de', '$2b$10$957SjQ2vLy8aBPIOn6aKduL/tMjzvKGSGK8N34idvLaf/PTjXG0ve', 2)";
  query(admin, []);

  // Insert User
  const defaultUser =
    "INSERT INTO `user` (`id`, `email`, `password`, `roleFk`) VALUES (2, 'test@example.de', '$2b$10$RZLpZn3IdVHfxn40HZdd8uZTjeRCgxkG2ZGTdzhqsTG6t/dK/BR7.', 1)";
  query(defaultUser, []);

  console.log("DB initialized");
}
