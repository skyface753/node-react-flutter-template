import bycrypt from 'bcrypt';
import { Pool, PoolConfig } from 'pg';

const dbConf = {
  primaryHost: process.env.DB_HOST_PRIMARY || 'localhost',
  primaryPort: parseInt(process.env.DB_PORT_PRIMARY || '5432') || 5432,
  replicaHost: process.env.DB_HOST_REPLICA || 'localhost',
  replicaPort: parseInt(process.env.DB_PORT_REPLICA || '5432') || 5432,
  user: process.env.DB_USER || 'testuser',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'testdb',
  // schema: process.env.DB_SCHEMA || 'testuser',
};

const pgConfigPrimary: PoolConfig = {
  host: dbConf.primaryHost,
  port: dbConf.primaryPort,
  user: dbConf.user,
  password: dbConf.password,
  database: dbConf.database,
};
const pgConfigReplica: PoolConfig = {
  host: dbConf.replicaHost,
  port: dbConf.replicaPort,
  user: dbConf.user,
  password: dbConf.password,
  database: dbConf.database,
};
const poolPrimay = new Pool(pgConfigPrimary);
const poolReplica = new Pool(pgConfigReplica);

/**
 * Primary query
 * @param sql
 * @param params
 * @returns
 * @throws
 * @example
 * const result = await query('INSERT INTO testuser.user (username, password) VALUES ($1, $2)', ['testuser', 'password']);
 * Write query
 */
async function queryPrimary(sql: string, params: unknown[]) {
  try {
    console.log('Primary query');
    console.log(sql);
    console.log(params);
    const result = await poolPrimay.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error(error);
    console.trace(error);
    throw error;
  }
}

/**
 * Replica query
 * @param sql
 * @param params
 * @returns
 * @throws
 * @example
 * const result = await queryReplica('SELECT * FROM testuser.user', []);
 * Read only replication
 **/
async function queryReplica(
  sql: string,
  params: unknown[],
  retry = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  try {
    // Check if the query is read only
    if (!sql.toLowerCase().startsWith('select')) {
      throw new Error('Replica query can only be read only');
    }
    console.log('Replica query');
    console.log(sql);
    console.log(params);

    const result = await poolReplica.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error(error);
    if (retry < 3) {
      console.log('Retry ------------------------------------');
      return queryReplica(sql, params, retry + 1);
    }
    throw error;
  }
}

export default {
  queryPrimary,
  queryReplica,
  initDb,
};
async function initDb() {
  try {
    // Create the Schema
    await queryPrimary('CREATE SCHEMA IF NOT EXISTS testuser', []);
    await queryPrimary(
      'CREATE TABLE IF NOT EXISTS testuser.role (id SERIAL PRIMARY KEY, title VARCHAR(255) UNIQUE NOT NULL);',
      []
    );
    await queryPrimary(
      'INSERT INTO testuser.role (title) VALUES ($1) ON CONFLICT DO NOTHING',
      ['user']
    );
    await queryPrimary(
      'INSERT INTO testuser.role (title) VALUES ($1) ON CONFLICT DO NOTHING',
      ['admin']
    );
    // id, username (unique), password, roleFk
    await queryPrimary(
      'CREATE TABLE IF NOT EXISTS testuser.user (id SERIAL PRIMARY KEY, username VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, roleFk INTEGER NOT NULL, CONSTRAINT fk_role FOREIGN KEY (roleFk) REFERENCES testuser.role (id) ON DELETE CASCADE);',
      []
    );
    const hashedUserPassword = await bycrypt.hash('User123', 10);
    const hashedAdminPassword = await bycrypt.hash('Admin123', 10);
    await queryPrimary(
      'INSERT INTO testuser.user (username, password, roleFk) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      ['user', hashedUserPassword, 1]
    );
    await queryPrimary(
      'INSERT INTO testuser.user (username, password, roleFk) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      ['admin', hashedAdminPassword, 2]
    );
    await queryPrimary(
      'CREATE TABLE IF NOT EXISTS testuser.avatar (userFk INTEGER REFERENCES testuser.user(id) ON DELETE CASCADE, originalName VARCHAR(255) NOT NULL, generatedPath VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, CONSTRAINT avatar_pk PRIMARY KEY (userFk, generatedPath));',
      []
    );
    await queryPrimary(
      'CREATE TABLE IF NOT EXISTS testuser.user_2fa (userFk INTEGER REFERENCES testuser.user(id) ON DELETE CASCADE, secretBase32 VARCHAR(255) NOT NULL, verified BOOLEAN NOT NULL DEFAULT FALSE, CONSTRAINT user_2fa_pk PRIMARY KEY (userFk));',
      []
    );
    // Test the replica
    await queryReplica('SELECT * FROM testuser.user', []).then((result) => {
      console.log(result);
    });
    console.info('Database initialized');
  } catch (error) {
    console.error(error);
  }
}

initDb();
// async function initDb() {
//   // Create Tables
//   const avatar =
//     'CREATE TABLE IF NOT EXISTS `avatar` (`userFk` int(11) NOT NULL, `originalName` varchar(250) NOT NULL, `generatedPath` varchar(250) NOT NULL, `type` varchar(50) NOT NULL, PRIMARY KEY (`userFk`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4';
//   const role =
//     'CREATE TABLE IF NOT EXISTS `role` ( `id` int(11) NOT NULL AUTO_INCREMENT, `title` varchar(50) NOT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4';
//   const user =
//     'CREATE TABLE IF NOT EXISTS `user` (`id` int(11) NOT NULL AUTO_INCREMENT,`username` varchar(100) NOT NULL, `email` varchar(100) NOT NULL,`password` varchar(250) NOT NULL,`roleFk` int(11) NOT NULL DEFAULT 1, PRIMARY KEY (`id`), KEY `role_fk` (`roleFk`), CONSTRAINT `role_fk` FOREIGN KEY (`roleFk`) REFERENCES `role` (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4';
//   const user_2fa =
//     'CREATE TABLE IF NOT EXISTS `user_2fa` ( `userFk` int(11) NOT NULL, `secretBase32` varchar(250) NOT NULL, `verified` tinyint(1) NOT NULL DEFAULT 0, PRIMARY KEY (`userFk`), CONSTRAINT `user2fa_userFK` FOREIGN KEY (`userFk`) REFERENCES `user` (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4';
//   const avatarResult = (await query(avatar, [])) as ResultSetHeader;
//   const roleResult = (await query(role, [])) as ResultSetHeader;
//   const userResult = (await query(user, [])) as ResultSetHeader;
//   const user2faResult = (await query(user_2fa, [])) as ResultSetHeader;

//   if (process.env.SQLDEBUG == 'true') {
//     console.log('Avatar Result: ' + JSON.stringify(avatarResult));
//     console.log('Role Result: ' + JSON.stringify(roleResult));
//     console.log('User Result: ' + JSON.stringify(userResult));
//     console.log('User 2FA Result: ' + JSON.stringify(user2faResult));
//   }
//   if (
//     avatarResult &&
//     avatarResult.warningStatus == 1 &&
//     roleResult &&
//     roleResult.warningStatus == 1 &&
//     userResult &&
//     userResult.warningStatus == 1 &&
//     user2faResult &&
//     user2faResult.warningStatus == 1
//   ) {
//     console.log('SQL Tables already exist - no need to create');
//     return;
//   }
//   console.log('Creating SQL Tables');
//   const commands: string[] = [];

//   commands.push('ALTER TABLE `user` ADD UNIQUE KEY `email` (`email`)');
//   commands.push('ALTER TABLE `user` ADD UNIQUE KEY `username` (`username`)');
//   commands.push(
//     'ALTER TABLE `avatar` ADD CONSTRAINT `user_fk` FOREIGN KEY (`userFk`) REFERENCES `user` (`id`)'
//   );
//   commands.push("INSERT INTO `role` (`id`, `title`) VALUES (1, 'user')");
//   commands.push("INSERT INTO `role` (`id`, `title`) VALUES (2, 'admin')");
//   commands.push(
//     "INSERT INTO `user` (`id`, `username`, `email`, `password`, `roleFk`) VALUES (1, 'skyface', 'admin@example.de', '$2b$10$957SjQ2vLy8aBPIOn6aKduL/tMjzvKGSGK8N34idvLaf/PTjXG0ve', 2)"
//   );
//   commands.push(
//     "INSERT INTO `user` (`id`, `username`, `email`, `password`, `roleFk`) VALUES (2, 'justANormalUser', 'test@example.de', '$2b$10$RZLpZn3IdVHfxn40HZdd8uZTjeRCgxkG2ZGTdzhqsTG6t/dK/BR7.', 1)"
//   );
//   // commands.push(
//   //   'ALTER TABLE `user_2fa` ADD CONSTRAINT `user2fa_userFK` FOREIGN KEY (`userFk`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;'
//   // );
//   const promises = [];
//   for (let i = 0; i < commands.length; i++) {
//     promises.push(
//       new Promise((resolve) => {
//         query(commands[i], []).then((result) => {
//           if (process.env.SQLDEBUG == 'true') {
//             console.log('SQL Result: ' + JSON.stringify(result));
//           }
//           resolve(result);
//         });
//       })
//     );
//   }
//   Promise.all(promises).then(() => {
//     console.log('SQL Tables created');
//   });
// }
