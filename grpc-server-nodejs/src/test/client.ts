import * as grpc from '@grpc/grpc-js';
import { AuthServiceClient } from '../proto/grpc-proto/auth_grpc_pb';
import { AvatarServiceClient } from '../proto/grpc-proto/avatar_grpc_pb';
import * as fs from 'fs';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getChannelCredentials(): grpc.ChannelCredentials {
  const rootCert = fs.readFileSync(
    path.resolve(__dirname, '../cert/ca-cert.pem')
  );

  // If you use CA root certificate
  // const channelCredentials = ChannelCredentials.createSsl();

  // If you use Self-Signed root certificate you need to provide it
  const channelCredentials = grpc.ChannelCredentials.createSsl(rootCert);

  return channelCredentials;
}
const client = new AuthServiceClient(
  'localhost:50051',
  grpc.credentials.createInsecure()
  // getChannelCredentials()
);

export const avatarClient = new AvatarServiceClient(
  'localhost:50051',
  grpc.credentials.createInsecure()
  // getChannelCredentials()
);

export default client;
