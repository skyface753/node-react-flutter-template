import * as grpc from '@grpc/grpc-js';
import { addReflection } from 'grpc-server-reflection';
import * as timestamp from 'google-protobuf/google/protobuf/timestamp_pb';
import { AuthServiceService } from './proto/auth_grpc_pb';
import { AuthServer } from './services/auth_service';

const server = new grpc.Server();
addReflection(server, './src/proto/descriptor_set.bin');

// Add the Services
server.addService(AuthServiceService, new AuthServer());

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
