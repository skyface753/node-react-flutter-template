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
import { UploadUrlResponse } from '../proto/avatar_pb';
import { READABLE_STREAM_EVENT } from '../types/stream';
// import { S3Connect } from './s3-storage/connector';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from './s3-storage/base-client';
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { AuthServer } from './auth_service';
import { User } from '../proto/auth_pb';

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
    call: ServerUnaryCall<Empty, UploadUrlResponse>,
    callback: sendUnaryData<UploadUrlResponse>
  ): Promise<void> {
    console.log('requestAUploadURL');
    // Auth Middleware
    AuthServer.checkToken(call.metadata, false, callback).then(
      async (user: User | null) => {
        if (!user) return;
        const res = new UploadUrlResponse();
        const params: PutObjectCommandInput = {
          Bucket: 'template',
          Key: 'avatars/' + user.getId(),
          // Expires: Type Date

          // Expires: 60,
          ContentType: 'image/png',
        };

        // const s3 = S3Connect();
        const url = await getSignedUrl(s3Client, new PutObjectCommand(params), {
          expiresIn: 120,
        });
        res.setUrl(url);
        callback(null, res);
      }
    );
    // callback({
    //   code: status.UNKNOWN,
    //   details: 'Unknown error',
    // });
  }

  // requestAUploadURL: handleUnaryCall<Empty, UploadUrlResponse>;
  // upload: handleUnaryCall<UploadRequest, UploadResponse>;
}
