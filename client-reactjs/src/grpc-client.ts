import { RpcError, UnaryResponse } from 'grpc-web';
import {
  AuthServicePromiseClient,
  DefaultAuthResponse,
  RefreshTokenRequest,
} from './proto/auth_grpc_web_pb';

import { AuthContext } from './App';
import { useContext } from 'react';
import { storeLogin } from './store/reducer';

class AuthInterceptor {
  intercept(request: any, invoker: any) {
    const metadata = request.getMetadata();
    metadata.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    return invoker(request)
      .then((response: UnaryResponse<any, any>) => {
        return response;
      })
      .catch(async (error: RpcError) => {
        // Error.code == 16 means UNAUTHENTICATED (see https://grpc.github.io/grpc/core/md_doc_statuscodes.html)
        if (error.code === 16) {
          // Refresh token

          const refreshTokenRequest = new RefreshTokenRequest();
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw error;
          }
          refreshTokenRequest.setRefreshToken(refreshToken);
          // Use BaseClient to avoid infinite loop -> Refresh the token
          return await grpcBaseAuthService
            .refreshToken(refreshTokenRequest, {})
            .then(async (response: DefaultAuthResponse) => {
              console.log('Refresh token success');
              storeLogin(response.toObject());
              const metadata = request.getMetadata(); // Retry the request with the new token
              metadata.Authorization = 'Bearer ' + response.getAccessToken();
              return invoker(request);
            })
            .catch((error: RpcError) => {
              throw error;
            });
        }

        return error;
      });
  }
}

const authInterceptor = new AuthInterceptor();
const options = {
  unaryInterceptors: [authInterceptor],
  streamInterceptors: [authInterceptor],
};

const host: string = 'http://localhost:8000';
export const grpcAuthService = new AuthServicePromiseClient(
  host,
  null,
  options
);

export const grpcBaseAuthService = new AuthServicePromiseClient(
  host,
  null,
  null
);
