# A Template Repository for Nodejs (server) with React and Flutter (client)

## Contains

### HTTP (REST API)

- [x] NodeJs (server) with Express, Typescript and plain SQL
- [x] ReactJs (client) with Typescript and Axios
- [x] Flutter (client)
- [x] Database (PostgreSQL Cluster)

### GRPC (gRPC API)

- [x] NodeJs (server) with Typescript, gRPC and prisma (ORM)
- [x] ReactJs (client) with Typescript and gRPC
- [] Flutter (client) (not yet)

## First steps

### GRPC

- server and client uses the .proto files from grpc-proto (`npm run proto` in both directories)
- server uses prisma to generate the ORM (`npm run prisma`)
- - .env file is used to configure the database connection (see .env.example)

1. Use this repository as template
2. (optional) Change environment Variables of the database and the the server in docker-compose.yml
3. Change the name of the project in package.json (server and clients)
4. Change the name of the project in pubspec.yaml (client-flutter)
5. Follow the steps in the README of the [server](http-server-nodejs/README.md) and [client-reactjs](http-client-reactjs/README.md) and [client-flutter](client-flutter/README.md)

## Environment variables

# Server (Server-Nodejs)

| Variable        | Required | Description           | Default             | Info                                                |
| --------------- | -------- | --------------------- | ------------------- | --------------------------------------------------- |
| DB_HOST_PRIMARY | No       | Primary database host | localhost           | The Primary Host of the Database (Postgres Cluster) |
| DB_HOST_REPLICA | No       | Replica database host | localhost           | The Replica Host of the Database (Postgres Cluster) |
| DB_PORT_PRIMARY | No       | Primary database port | 5432                | The Primary Port of the Database                    |
| DB_PORT_REPLICA | No       | Replica database port | 5432                | The Replica Port of the Database                    |
| DB_USER         | No       | Database user         | testuser            | The user of the Database                            |
| DB_PASSWORD     | No       | Database password     | password            | The password of the Database                        |
| DB_DATABASE     | No       | Database name         | testdb              | The name of the Database                            |
| JWT_SECRET      | No       | JWT secret            | secret              | The secret of the JWT                               |
| BCRYPT_ROUNDS   | No       | Bcrypt rounds         | 10                  | The rounds of the Bcrypt                            |
| REDIS_HOST      | No       | Redis host            | redis               | The host of the Redis                               |
| REDIS_PORT      | No       | Redis port            | 6379                | The port of the Redis                               |
| REDIS_PASSWORD  | No       | Redis password        | <empty>             | The password of the Redis                           |
| FRONTEND_URL    | No       | Frontend URL          | http://localhost:80 | The URL of the Frontend (CORS)                      |

## Volumes

### Server

/app/files/avatars/

## TODO

- [] Flutter - rewrite to postgres -> lowercase
- [x] React
- [] NodeJs - rewrite to postgres (avatar)
