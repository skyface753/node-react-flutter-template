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
//  import {EchoServicePromiseClient} from './generated/echo_grpc_web_pb';
import { AuthServicePromiseClient } from './proto/auth_grpc_web_pb';

// The UnaryInterceptor interface is for the promise-based client.
class MyUnaryInterceptor
  implements grpcWeb.UnaryInterceptor<StatusRequest, StatusResponse>
{
  intercept(
    request: grpcWeb.Request<StatusRequest, StatusResponse>,
    invoker: (
      request: grpcWeb.Request<StatusRequest, StatusResponse>
    ) => Promise<grpcWeb.UnaryResponse<StatusRequest, StatusResponse>>
  ) {
    const reqMsg = request.getRequestMessage();
    reqMsg.setAccessToken('[-out-]' + reqMsg.getAccessToken());
    return invoker(request).then(
      (response: grpcWeb.UnaryResponse<StatusRequest, StatusResponse>) => {
        let result = '<-InitialMetadata->';
        let initialMetadata = response.getMetadata();
        for (let i in initialMetadata) {
          result += i + ': ' + initialMetadata[i];
        }
        result += '<-TrailingMetadata->';
        let trailingMetadata = response.getStatus().metadata;
        for (let i in trailingMetadata) {
          result += i + ': ' + trailingMetadata[i];
        }
        const responseMsg = response.getResponseMessage();
        result += '[-in-]' + responseMsg.getUser()?.getId();
        responseMsg.getUser()?.setUsername(result);
        return response;
      }
    );
  }
}

var opts = { unaryInterceptors: [new MyUnaryInterceptor()] };

const echoService2 = new AuthServicePromiseClient(
  'http://localhost:8000',
  null,
  opts
);

export { echoService2, StatusRequest };
