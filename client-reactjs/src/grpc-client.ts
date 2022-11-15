import { RpcError, UnaryResponse } from 'grpc-web';
import {
  AuthServicePromiseClient,
  DefaultAuthResponse,
  RefreshTokenRequest,
} from './proto/auth_grpc_web_pb';

class AuthInterceptor {
  intercept(request: any, invoker: any) {
    const metadata = request.getMetadata();
    metadata.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
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
          refreshTokenRequest.setRefreshToken(
            localStorage.getItem('refreshToken') || ''
          );
          console.log('IN INTERCEPTOR - REFRESH TOKEN');
          grpcBaseAuthService
            .refreshToken(refreshTokenRequest, {})
            .then((response: DefaultAuthResponse) => {
              console.log(
                'IN INTERCEPTOR - REFRESH TOKEN: ' + response.toObject()
              );
              localStorage.setItem('accessToken', response.getAccessToken());
              localStorage.setItem('refreshToken', response.getRefreshToken());
              const metadata = request.getMetadata();
              metadata.Authorization = 'Bearer ' + response.getAccessToken();
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
