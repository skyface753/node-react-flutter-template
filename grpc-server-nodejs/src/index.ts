import * as grpc from '@grpc/grpc-js';
import { addReflection } from 'grpc-server-reflection';
import { AuthServiceService } from './proto/grpc-proto/auth_grpc_pb';
import { AuthServer } from './services/auth_service';
import { AvatarServer } from './services/avatar_service';
import { AvatarServiceService } from './proto/grpc-proto/avatar_grpc_pb';

const server = new grpc.Server();
addReflection(server, './src/proto/descriptor_set.bin');

// Add the Services
server.addService(AuthServiceService, new AuthServer());
server.addService(AvatarServiceService, new AvatarServer());
// Start the server
const port = process.env.PORT || 50051;
server.bindAsync(
  `localhost:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      throw err;
    }
    console.log(`Server running on port ${port}`);
    server.start();
  }
);

export default server;
