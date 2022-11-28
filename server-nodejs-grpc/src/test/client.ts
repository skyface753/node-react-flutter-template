import * as grpc from '@grpc/grpc-js';
import { AuthServiceClient } from '../proto/auth_grpc_pb';

const client = new AuthServiceClient(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

export default client;
