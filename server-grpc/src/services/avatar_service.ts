import {
  handleUnaryCall,
  sendUnaryData,
  ServerReadableStream,
  ServerUnaryCall,
  status,
} from '@grpc/grpc-js';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { FilesHelper } from '../helpers/files';
import { IAvatarServiceServer } from '../proto/avatar_grpc_pb';
import { UploadUrlRequest, UploadUrlResponse } from '../proto/avatar_pb';
import { READABLE_STREAM_EVENT } from '../types/stream';
// import { S3Connect } from './s3-storage/connector';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from './s3-storage/base-client';
import {
  CreateBucketCommand,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { AuthServer } from './auth_service';
import { User } from '../proto/auth_pb';

export const bucketParams = {
  Bucket: `template-bucket`,
  Key: `avatars`,
  Body: 'BODY',
};
async function createBucket() {
  try {
    // Create an S3 bucket.
    console.log(`Creating bucket ${bucketParams.Bucket}`);
    await s3Client.send(
      new CreateBucketCommand({ Bucket: bucketParams.Bucket })
    );
    console.log(`Waiting for "${bucketParams.Bucket}" bucket creation...`);
  } catch (err) {
    console.log('Error creating bucket', err);
  }
}
createBucket();
export class AvatarServer implements IAvatarServiceServer {
  //   delete: handleUnaryCall<Empty, Empty>;
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall;

  // async upload(
  //   call: ServerReadableStream<UploadRequest, UploadResponse>,
  //   callback: sendUnaryData<UploadResponse>
  // ): Promise<void> {
  //   console.log('upload');
  //   const res = new UploadResponse();
  //   const chunks: Uint8Array[] = [];
  //   call.on(READABLE_STREAM_EVENT.DATA, (chunk: UploadRequest) => {
  //     chunks.push(chunk.getBinary_asU8());
  //   });
  //   call.on(READABLE_STREAM_EVENT.END, async () => {
  //     const desiredSize = { width: 250, height: 250 }; // consider getting these values in request
  //     const imageBuff = Buffer.concat(chunks);
  //     // const resized = await ImageService.resize(imageBuff, desiredSize.width, desiredSize.height);
  //     // you may want to replace this with a S3 pipe etc.
  //     await FilesHelper.write(
  //       imageBuff,
  //       `./assets/image_raw_${desiredSize.width}x${desiredSize.height}.png`
  //     );

  //     // res.setUrl('https://mydomain.com/resized_image.png');
  //     callback(null, res);
  //   });
  //   call.on(READABLE_STREAM_EVENT.ERROR, (err: Error) => {
  //     console.error(err);
  //     callback(err, res);
  //   });
  // }
  delete(
    call: ServerUnaryCall<Empty, Empty>,
    callback: sendUnaryData<Empty>
  ): void {
    console.log('delete');
    callback(null, new Empty());
  }
  async requestAUploadURL(
    call: ServerUnaryCall<UploadUrlRequest, UploadUrlResponse>,
    callback: sendUnaryData<UploadUrlResponse>
  ): Promise<void> {
    console.log('requestAUploadURL');
    const filename = call.request.getFilename();
    const fileExtension = filename.split('.').pop();
    if (!fileExtension || !['png', 'jpg', 'jpeg'].includes(fileExtension)) {
      return callback(
        {
          code: status.INVALID_ARGUMENT,
          message: 'Invalid file extension',
        },
        null
      );
    }
    // Auth Middleware
    AuthServer.checkToken(call.metadata, false, callback).then(
      async (user: User | null) => {
        if (!user) return;
        const res = new UploadUrlResponse();
        const params: PutObjectCommandInput = {
          Bucket: bucketParams.Bucket,

          // Key: 'avatars/' + user.getId() + '.' + fileExtension,
          Key:
            'avatars/' +
            user.getId() +
            '-' +
            createRandomString(10) +
            '.' +
            fileExtension,
          ContentType: 'image/' + fileExtension,
        };
        const url = await getSignedUrl(s3Client, new PutObjectCommand(params), {
          expiresIn: 120,
        });
        res.setUrl(url);
        callback(null, res);
      }
    );
  }
}

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
