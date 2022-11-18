// Create service client module using ES6 syntax.
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { S3Config } from '../../config';
// // Set the AWS Region.
// const REGION = "us-east-1";
const config: S3ClientConfig = {
  apiVersion: 'latest',
  endpoint: S3Config.endpoint_url,
  region: 'us-east-1',
  forcePathStyle: true,
  credentials: {
    accessKeyId: S3Config.access_key,
    secretAccessKey: S3Config.secret_key,
  },
  // // signatureVersion: 'v4',
  // signatureVersion: 'v4',
};
// Create an Amazon S3 service client object.
const s3Client = new S3Client(config);
export { s3Client };
