export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10') || 10;
export const isProduction: boolean = process.env.NODE_ENV === 'production';
export const REDIS = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
};
export const S3Config = {
  endpoint_url: process.env.S3_ENDPOINT_URL || 'http://localhost:9000',
  bucket: process.env.S3_BUCKET || 'test-bucket',
  // endpoint_url: process.env.S3_ENDPOINT_URL || 'https://eu2.contabostorage.com',
  access_key: process.env.S3_ACCESS || 'minio-root-user',
  secret_key: process.env.S3_SECRET_KEY || 'minio-root-password',
};

export const ttl = 10 * 60; // 10 minutes (token and s3 presigned url)
