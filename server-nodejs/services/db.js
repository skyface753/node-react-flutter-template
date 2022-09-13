const mysql = require('mysql2/promise');
const config = require('../config.json');

// var retryCounter = 0;
async function query(sql, params) {
  try {
    if (process.env.SQLDEBUG == 'true') {
      console.log('SQL Query: ' + sql);
      console.log('SQL Params: ' + JSON.stringify(params));
      console.log('DB CONFIG: ' + JSON.stringify(config.SQLDB));
    }
    const connection = await mysql.createConnection(config.SQLDB);
    const [results] = await connection.execute(sql, params);
    connection.end();
    return results;
  } catch (error) {
    console.log('SQL ERROR: ' + error);
    return false;
  }
}

async function showTables(req, res) {
  try {
    const connection = await mysql.createConnection(config.SQLDB);
    const [results] = await connection.execute('SHOW TABLES');

    // Show Create command
    for (let i = 0; i < results.length; i++) {
      const [table] = await connection.execute(
        'SHOW CREATE TABLE ' + results[i].Tables_in_database
      );
      console.log(table[0]['Create Table']);
    }
    connection.end();
    res.send({
      message: 'Tables shown',
    });
  } catch (error) {
    console.log('SQL ERROR: ' + error);
    return false;
  }
}

module.exports = {
  query,
  showTables,
};
initDb();
async function initDb() {
  // Create Tables
  const avatar =
    'CREATE TABLE IF NOT EXISTS `avatar` (`userFk` int(11) NOT NULL, `originalName` varchar(250) NOT NULL, `generatedPath` varchar(250) NOT NULL, `type` varchar(50) NOT NULL, PRIMARY KEY (`userFk`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4';
  const role =
    'CREATE TABLE IF NOT EXISTS `role` ( `id` int(11) NOT NULL AUTO_INCREMENT, `title` varchar(50) NOT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4';
  const user =
    'CREATE TABLE IF NOT EXISTS `user` (`id` int(11) NOT NULL AUTO_INCREMENT,`email` varchar(100) NOT NULL,`password` varchar(250) NOT NULL,`roleFk` int(11) NOT NULL DEFAULT 1, PRIMARY KEY (`id`), KEY `role_fk` (`roleFk`), CONSTRAINT `role_fk` FOREIGN KEY (`roleFk`) REFERENCES `role` (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4';
  var avatarResult = await query(avatar, []);
  var roleResult = await query(role, []);
  var userResult = await query(user, []);
  if (process.env.SQLDEBUG == 'true') {
    console.log('Avatar Result: ' + JSON.stringify(avatarResult));
    console.log('Role Result: ' + JSON.stringify(roleResult));
    console.log('User Result: ' + JSON.stringify(userResult));
  }
  if (
    avatarResult.warningStatus == 1 &&
    roleResult.warningStatus == 1 &&
    userResult.warningStatus == 1
  ) {
    console.log('SQL Tables already exist - no need to create');
    return;
  }
  console.log('Creating SQL Tables');
  var commands = [];

  commands.push('ALTER TABLE `user` ADD UNIQUE KEY `email` (`email`)');
  commands.push(
    'ALTER TABLE `avatar` ADD CONSTRAINT `user_fk` FOREIGN KEY (`userFk`) REFERENCES `user` (`id`)'
  );
  commands.push("INSERT INTO `role` (`id`, `title`) VALUES (1, 'user')");
  commands.push("INSERT INTO `role` (`id`, `title`) VALUES (2, 'admin')");
  commands.push(
    "INSERT INTO `user` (`id`, `email`, `password`, `roleFk`) VALUES (1, 'admin@example.de', '$2b$10$957SjQ2vLy8aBPIOn6aKduL/tMjzvKGSGK8N34idvLaf/PTjXG0ve', 2)"
  );
  commands.push(
    "INSERT INTO `user` (`id`, `email`, `password`, `roleFk`) VALUES (2, 'test@example.de', '$2b$10$RZLpZn3IdVHfxn40HZdd8uZTjeRCgxkG2ZGTdzhqsTG6t/dK/BR7.', 1)"
  );
  var promises = [];
  for (let i = 0; i < commands.length; i++) {
    promises.push(
      new Promise((resolve) => {
        query(commands[i], []).then((result) => {
          if (process.env.SQLDEBUG == 'true') {
            console.log('SQL Result: ' + JSON.stringify(result));
          }
          resolve(result);
        });
      })
    );
  }
  Promise.all(promises).then(() => {
    console.log('SQL Tables created');
  });
}
