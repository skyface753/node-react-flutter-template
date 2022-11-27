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
import {
  GetAvatarViewRequest,
  GetAvatarViewResponse,
  UploadUrlRequest,
  UploadUrlResponse,
} from '../proto/avatar_pb';
import { READABLE_STREAM_EVENT } from '../types/stream';
// import { S3Connect } from './s3-storage/connector';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from './s3-storage/base-client';
import {
  CreateBucketCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { AuthServer } from './auth_service';
import { User } from '../proto/auth_pb';

import db from './db';
import { S3Config } from '../config';
import { getAvatarKey } from '../helpers/s3-helper';
async function createBucket() {
  try {
    // Create an S3 bucket.
    console.log(`Creating bucket ${S3Config.bucket}`);
    await s3Client.send(new CreateBucketCommand({ Bucket: S3Config.bucket }));
    console.log(`Waiting for "${S3Config.bucket}" bucket creation...`);
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
          Bucket: S3Config.bucket,

          // Key: 'avatars/' + user.getId() + '.' + fileExtension,
          Key: getAvatarKey(user.getId(), fileExtension),
          ContentType: 'image/' + fileExtension,
        };
        const url = await getSignedUrl(s3Client, new PutObjectCommand(params), {
          expiresIn: 120,
        });
        res.setUrl(url);
        // testuser.avatar (originalname, generatedpath, type, userfk)
        await db.queryPrimary(
          `INSERT INTO testuser.avatar (originalname, generatedpath, type, userfk) VALUES ($1, $2, $3, $4) ON CONFLICT (userfk) DO UPDATE SET originalname = $1, generatedpath = $2, type = $3`,
          [
            filename,
            params.Key,
            'image/' + fileExtension,
            user.getId().toString(),
          ]
        );
        callback(null, res);
      }
    );
  }
  //  getAvatarView: handleUnaryCall<GetAvatarViewRequest, GetAvatarViewResponse>;
  async getAvatarView(
    call: ServerUnaryCall<GetAvatarViewRequest, GetAvatarViewResponse>,
    callback: sendUnaryData<GetAvatarViewResponse>
  ): Promise<void> {
    console.log('getAvatarView');
    const { userid } = call.request.toObject();
    if (!userid || isNaN(userid)) {
      return callback(
        {
          code: status.INVALID_ARGUMENT,
          message: 'Invalid id',
        },
        null
      );
    }
    const res = new GetAvatarViewResponse();
    // TODO: Auth Middleware???
    // const user = await AuthServer.checkToken(call.metadata, false, callback);
    // if (!user) return;
    const avatar = await db.queryPrimary(
      `SELECT * FROM testuser.avatar WHERE userfk = $1`,
      [userid]
    );
    if (avatar.length === 0) {
      return callback(
        {
          code: status.NOT_FOUND,
          message: 'Avatar not found',
        },
        null
      );
    }
    const params = {
      Bucket: S3Config.bucket,
      Key: avatar[0].generatedpath,
    };
    const url = await getSignedUrl(s3Client, new GetObjectCommand(params), {
      expiresIn: 120,
    });
    res.setUrl(url);
    callback(null, res);

    // if (avatar.length > 0) {
    //   res.setUrl(
    //     `https://${bucketParams.Bucket}.s3.amazonaws.com/${avatar[0].generatedpath}`
    //   res.setAvatar(avatar.rows[0].generatedpath);
    // }
    // callback(null, res);
  }
}
