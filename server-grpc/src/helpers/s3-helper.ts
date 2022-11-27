import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Config } from '../config';
import { s3Client } from '../services/s3-storage/base-client';

function createRandomString(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const getAvatarKey = (userId: number, fileExtension: string) => {
  return `avatars/${userId}-${createRandomString(10)}.${fileExtension}`;
};

// const params = {
//   Bucket: S3Config.bucket,
//   Key: userDb[0].generatedpath,
// };
// const avatarUrl = await getSignedUrl(s3Client, new GetObjectCommand(params), {
//   expiresIn: 120,
// });

export const getAvatarUrl = async (generatedPath: string) => {
  const params = {
    Bucket: S3Config.bucket,
    Key: generatedPath,
  };
  return await getSignedUrl(s3Client, new GetObjectCommand(params), {
    expiresIn: 120,
  });
};
