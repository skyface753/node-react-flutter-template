// import S3, { PutObjectOutput } from 'aws-sdk/clients/s3';
// import { AWSError } from 'aws-sdk/lib/error';
// import { S3Connect } from './connector';

// export async function Upload(bucket: string, file, objectName: string) {
//   // return new Promise<string>((resolve, reject) => {
//   const s3 = S3Connect();
//   const params: S3.PutObjectRequest = {
//     Bucket: bucket,
//     Key: objectName, // File name you want to save as in S3
//     Body: file.buffer,
//     ACL: 'public-read',
//     ContentType: file.mimetype,
//   };
//   var response = await s3
//     .putObject(params, (err: AWSError, data: PutObjectOutput) => {
//       if (err) console.log(err);

//       return `${process.env.S3_ENDPOINT_URL}${bucket}/${objectName}`;
//     })
//     .promise();
//   return response;
//   // });
// }
