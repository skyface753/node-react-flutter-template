import {
  handleClientStreamingCall,
  handleUnaryCall,
  sendUnaryData,
  ServerReadableStream,
  ServerUnaryCall,
  status,
} from '@grpc/grpc-js';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { IAvatarServiceServer } from '../proto/grpc-proto/avatar_grpc_pb';
import {
  ConfirmUploadRequest,
  ConfirmUploadResponse,
  GetAvatarViewRequest,
  GetAvatarViewResponse,
  UploadImageRequest,
  UploadImageResponse,
  UploadUrlRequest,
  UploadUrlResponse,
} from '../proto/grpc-proto/avatar_pb';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from './s3-storage/base-client';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { AuthServer } from './auth_service';
import { User } from '../proto/grpc-proto/auth_pb';

import { prismaClient } from './db';
import { S3Config, ttl } from '../config';
import { getAvatarKey } from '../helpers/s3-helper';
import { Prisma } from '@prisma/client';

export class AvatarServer implements IAvatarServiceServer {
  // confirmUpload: handleUnaryCall<ConfirmUploadRequest, ConfirmUploadResponse>;
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall;

  delete(
    call: ServerUnaryCall<Empty, Empty>,
    callback: sendUnaryData<Empty>
  ): void {
    throw new Error('Method not implemented.');
    console.log('delete');
    callback(null, new Empty());
  }
  //uploadImage: grpc.handleClientStreamingCall<grpc_proto_avatar_pb.UploadImageRequest, grpc_proto_avatar_pb.UploadImageResponse>
  uploadImage(
    call: ServerReadableStream<UploadImageRequest, UploadImageResponse>,
    callback: sendUnaryData<UploadImageResponse>
  ): void {
    console.log('uploadImage');
    call.on('data', (data) => {
      console.log(data);
    });
    call.on('end', () => {
      console.log('end');
      callback(null, new UploadImageResponse());
    });
    throw new Error('Method not implemented.');
  }

  confirmUpload(
    call: ServerUnaryCall<ConfirmUploadRequest, ConfirmUploadResponse>,
    callback: sendUnaryData<ConfirmUploadResponse>
  ): void {
    console.log('confirmUpload');
    throw new Error('Method not implemented.');
    // callback(null, new ConfirmUploadResponse());
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
          expiresIn: ttl,
        });
        res.setUrl(url);
        // testuser.avatar (originalname, generatedpath, type, userfk)
        await prismaClient.avatar
          .create({
            data: {
              originalname: filename,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              generatedpath: params.Key!,
              type: 'image/' + fileExtension,
              userfk: user.getId(),
            },
          })
          .catch(async (err) => {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
              if (err.code === 'P2002') {
                await prismaClient.avatar.update({
                  where: {
                    userfk: user.getId(),
                  },
                  data: {
                    originalname: filename,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    generatedpath: params.Key!,
                    type: 'image/' + fileExtension,
                  },
                });
              }
            }
          });
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

    // const avatar = await db.queryPrimary(
    //   `SELECT * FROM testuser.avatar WHERE userfk = $1`,
    //   [userid]
    // );
    const avatar = await prismaClient.avatar.findUnique({
      where: {
        userfk: userid,
      },
    });
    if (!avatar) {
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
      Key: avatar.generatedpath,
    };
    const url = await getSignedUrl(s3Client, new GetObjectCommand(params), {
      // 10 minutes
      expiresIn: 600,
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
