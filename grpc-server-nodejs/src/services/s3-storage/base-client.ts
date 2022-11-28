// Create service client module using ES6 syntax.
import {
  CreateBucketCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { isProduction, S3Config } from '../../config';

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
export const s3Client = new S3Client(config);
// export { s3Client };

async function createBucket() {
  try {
    // Create an S3 bucket.
    console.log(`Creating bucket ${S3Config.bucket}`);
    await s3Client.send(new CreateBucketCommand({ Bucket: S3Config.bucket }));
    console.log(`Waiting for "${S3Config.bucket}" bucket creation...`);
  } catch (err) {
    if (!isProduction) {
      console.log('Error creating bucket', err);
    }
  }
}
createBucket();
