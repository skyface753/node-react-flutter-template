# GRPC Server with Go

## Environment

| Var               | Required | Default               | Description         |
| ----------------- | -------- | --------------------- | ------------------- |
| POSTGRES_HOST     | false    | localhost             | Host of Postgres DB |
| POSTGRES_PORT     | false    | 5432                  |                     |
| POSTGRES_USER     | false    | testuser              |                     |
| POSTGRES_PASSWORD | false    | password              |                     |
| POSTGRES_DB       | false    | testdb                |                     |
| POSTGRES_SSLMODE  | false    | disable               |                     |
| JWT_SECRET        | false    | secret                |                     |
| REDIS_HOST        | false    | localhost             |                     |
| REDIS_PORT        | false    | 6379                  |                     |
| REDIS_PASSWORD    | false    |                       |                     |
| REDIS_DB          | false    | 0                     |                     |
| S3_BUCKET         | false    | bucket                |                     |
| S3_KEY_PREFIX     | false    | avatars/              |                     |
| S3_ENDPOINT       | false    | http://localhost:9000 |                     |
| S3_USERNAME       | false    | minio-root-user       |                     |
| S3_PASSWORD       | false    | minio-root-password   |                     |
