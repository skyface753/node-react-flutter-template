import {
  handleUnaryCall,
  sendUnaryData,
  ServerReadableStream,
  ServerUnaryCall,
} from '@grpc/grpc-js';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { FilesHelper } from '../helpers/files';
import { IAvatarServiceServer } from '../proto/avatar_grpc_pb';
import { UploadRequest, UploadResponse } from '../proto/avatar_pb';
import { READABLE_STREAM_EVENT } from '../types/stream';

export class AvatarServer implements IAvatarServiceServer {
  //   delete: handleUnaryCall<Empty, Empty>;
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall;

  async upload(
    call: ServerReadableStream<UploadRequest, UploadResponse>,
    callback: sendUnaryData<UploadResponse>
  ): Promise<void> {
    console.log('upload');
    const res = new UploadResponse();
    const chunks: Uint8Array[] = [];
    call.on(READABLE_STREAM_EVENT.DATA, (chunk: UploadRequest) => {
      chunks.push(chunk.getBinary_asU8());
    });
    call.on(READABLE_STREAM_EVENT.END, async () => {
      const desiredSize = { width: 250, height: 250 }; // consider getting these values in request
      const imageBuff = Buffer.concat(chunks);
      // const resized = await ImageService.resize(imageBuff, desiredSize.width, desiredSize.height);
      // you may want to replace this with a S3 pipe etc.
      await FilesHelper.write(
        imageBuff,
        `./assets/image_raw_${desiredSize.width}x${desiredSize.height}.png`
      );

      // res.setUrl('https://mydomain.com/resized_image.png');
      callback(null, res);
    });
    call.on(READABLE_STREAM_EVENT.ERROR, (err: Error) => {
      console.error(err);
      callback(err, res);
    });
  }
  delete(
    call: ServerUnaryCall<Empty, Empty>,
    callback: sendUnaryData<Empty>
  ): void {
    console.log('delete');
    callback(null, new Empty());
  }
  // upload: handleUnaryCall<UploadRequest, UploadResponse>;
}
