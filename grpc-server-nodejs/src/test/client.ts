import * as grpc from '@grpc/grpc-js';
import { AuthServiceClient } from '../proto/grpc-proto/auth_grpc_pb';
import { AvatarServiceClient } from '../proto/grpc-proto/avatar_grpc_pb';

const client = new AuthServiceClient(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

export const avatarClient = new AvatarServiceClient(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

export default client;
