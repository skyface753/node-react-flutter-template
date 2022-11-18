export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10') || 10;
export const REDIS = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
};
export const S3Config = {
  // endpoint_url: process.env.S3_ENDPOINT_URL || 'http://localhost:9000',
  endpoint_url: process.env.S3_ENDPOINT_URL || 'https://eu2.contabostorage.com',
  access_key: process.env.S3_ACCESS || 'minioadmin',
  secret_key: process.env.S3_SECRET_KEY || 'minioadmin',
};
