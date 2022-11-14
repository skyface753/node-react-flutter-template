/**
 *
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import * as grpcWeb from 'grpc-web';

import { StatusRequest, StatusResponse } from './proto/auth_pb';
//  import {EchoRequest, EchoResponse} from './generated/echo_pb';
// import {EchoServiceClient} from './generated/echo_grpc_web_pb';
import { AuthServiceClient } from './proto/auth_grpc_web_pb';

// The StreamInterceptor interface is for the callback-based client.
class MyStreamInterceptor
  implements grpcWeb.StreamInterceptor<StatusRequest, StatusResponse>
{
  intercept(
    request: grpcWeb.Request<StatusRequest, StatusResponse>,
    invoker: (
      request: grpcWeb.Request<StatusRequest, StatusResponse>
    ) => grpcWeb.ClientReadableStream<StatusResponse>
  ) {
    class InterceptedStream
      implements grpcWeb.ClientReadableStream<StatusResponse>
    {
      stream: grpcWeb.ClientReadableStream<StatusResponse>;
      constructor(stream: grpcWeb.ClientReadableStream<StatusResponse>) {
        this.stream = stream;
      }
      on(eventType: string, callback: any) {
        if (eventType == 'data') {
          const newCallback = (response: StatusResponse) => {
            response.getUser()?.setId(123);
            //  response.setMessage('[-in-]'+response.getMessage());
            callback(response);
          };
          this.stream.on(eventType, newCallback);
        } else if (eventType == 'error') {
          this.stream.on('error', callback);
        } else if (eventType == 'metadata') {
          console.log('metadata', request.getMetadata());

          this.stream.on('metadata', callback);
        } else if (eventType == 'status') {
          this.stream.on('status', callback);
        } else if (eventType == 'end') {
          this.stream.on('end', callback);
        }
        return this;
      }
      removeListener(eventType: string, callback: any) {}
      cancel() {}
    }
    var reqMsg = request.getRequestMessage();
    reqMsg.setAccessToken('Bearer ' + localStorage.getItem('token'));
    //  reqMsg.setMessage('[-out-]'+reqMsg.getMessage());
    return new InterceptedStream(invoker(request));
  }
}

var opts = { streamInterceptors: [new MyStreamInterceptor()] };

const echoService = new AuthServiceClient('http://localhost:8000', null, opts);

export { echoService, StatusResponse };
