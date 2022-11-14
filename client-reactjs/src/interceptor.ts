import { RpcError, UnaryResponse } from 'grpc-web';
import {
  AuthServicePromiseClient,
  DefaultAuthResponse,
  RefreshTokenRequest,
} from './proto/auth_grpc_web_pb';

class AuthInterceptor {
  token: string;
  refreshToken: string;

  // constructor(token: string) {
  constructor() {
    this.token =
      'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyIiwicm9sZSI6MCwiaWF0IjoxNjY4NDM2ODIxLCJleHAiOjE2Njg0Mzc0MjF9.UvEp0AWtmnLT8ieLQINACuTgI-3ML_e7m_Khwqy46UY';
    this.refreshToken =
      '89f5920848208a7b3ecc3094d50917d1530aa790d080f0c745a34335df96b05ac3552a30428d6ff38f5dda61075d22e2b20341ef50fd718f3a79162480dcd8dc';
  }

  intercept(request: any, invoker: any) {
    const metadata = request.getMetadata();
    metadata.Authorization = 'Bearer ' + this.token;
    return invoker(request)
      .then((response: UnaryResponse<any, any>) => {
        console.log('IN INTERCEPTOR - INVOKER: ' + response.getStatus().code);
        return response;
      })
      .catch((error: RpcError) => {
        console.log('IN INTERCEPTOR - ERROR: ' + error.code);
        // Error.code == 16 means UNAUTHENTICATED (see https://grpc.github.io/grpc/core/md_doc_statuscodes.html)
        if (error.code === 16) {
          // Refresh token

          const refreshTokenRequest = new RefreshTokenRequest();
          refreshTokenRequest.setRefreshToken(this.refreshToken);
          console.log('IN INTERCEPTOR - REFRESH TOKEN');
          baseService
            .refreshToken(refreshTokenRequest, {})
            .then((response: DefaultAuthResponse) => {
              console.log(
                'IN INTERCEPTOR - REFRESH TOKEN: ' + response.toObject()
              );
              this.token = response.getAccessToken();
              this.refreshToken = response.getRefreshToken();
              const metadata = request.getMetadata();
              metadata.Authorization = 'Bearer ' + this.token;
              return invoker(request);
            })
            .catch((error: RpcError) => {
              console.trace(error);
              console.log(
                'IN INTERCEPTOR - REFRESH TOKEN ERROR: ' + error.code
              );
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
export const service = new AuthServicePromiseClient(host, null, options);

const baseService = new AuthServicePromiseClient(host, null, null);
