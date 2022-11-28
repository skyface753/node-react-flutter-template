import { Request } from 'grpc-web';
import {
  AuthServiceClient,
  AuthServicePromiseClient,
} from './proto/auth_grpc_web_pb';
// import { UnaryInterceptor, StreamInterceptor } from './interceptor';

export default new AuthServiceClient('http://localhost:8000', null, null);

// export class interceptor1 {
//   intercept = function (request: any, invoker: any) {
//     // Set the metadata
//     const metadata = new Request();
//     metadata.('Authorization', 'Bearer ' + localStorage.getItem('token'));
//     request.setMetadata(metadata);

//     // Update the request message before the RPC.
//     const reqMsg = request.getRequestMessage();
//     console.log('interceptor1', reqMsg.toObject());
//     request.withMetadata({ 'x-custom-header': 'interceptor1' });
//     console.log('Metadata', request.getMetadata());
//     reqMsg.setMessage('[Intercept request]' + reqMsg.getMessage());
//     // After the RPC returns successfully, update the response.
//     return invoker(request).then((response: any) => {
//       // You can also do something with response metadata here.
//       console.log(response.getMetadata());
//     });
//   };
// }

// export const promiseClient = new AuthServicePromiseClient(
//   'http://localhost:8000',
//   null,
//   {
//     unaryInterceptors: [new UnaryInterceptor()],
//     streamInterceptors: [new StreamInterceptor()],
//   }
// );
