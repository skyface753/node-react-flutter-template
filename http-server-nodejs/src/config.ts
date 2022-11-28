export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10') || 10;
export const REDIS = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
};
