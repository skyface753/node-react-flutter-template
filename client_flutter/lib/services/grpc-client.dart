import 'dart:async';

import 'package:client_flutter/src/generated/grpc-proto/auth.pbgrpc.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:grpc/grpc.dart';
import 'package:grpc/grpc_web.dart';

String grpcWebUrl = "http://localhost:8000";
String grpcHost = "localhost";
int grpcPort = 50051;

class GrpcClient {
  static AuthServiceClient? _client;
  static AuthServiceClient? _baseClient;
  static String accessToken = "";

  static AuthServiceClient getClient() {
    if (_client == null) {
      if (kIsWeb) {
        final channel = GrpcWebClientChannel.xhr(Uri.parse(grpcWebUrl));
        _client = AuthServiceClient(channel, interceptors: [
          AuthenticationInterceptor(),
        ]);
      } else {
        final channel = ClientChannel(
          grpcHost,
          port: grpcPort,
          options: ChannelOptions(
            credentials: ChannelCredentials.insecure(),
            codecRegistry:
                CodecRegistry(codecs: const [GzipCodec(), IdentityCodec()]),
          ),
        );
        _client = AuthServiceClient(channel,
            interceptors: [AuthenticationInterceptor()]);
      }
    }
    return _client!;
  }

  static AuthServiceClient getBaseClient() {
    if (_baseClient == null) {
      if (kIsWeb) {
        final channel = GrpcWebClientChannel.xhr(Uri.parse(grpcWebUrl));
        _baseClient = AuthServiceClient(channel);
      } else {
        final channel = ClientChannel(
          grpcHost,
          port: grpcPort,
          options: ChannelOptions(
            credentials: ChannelCredentials.insecure(),
            codecRegistry:
                CodecRegistry(codecs: const [GzipCodec(), IdentityCodec()]),
          ),
        );
        _baseClient = AuthServiceClient(channel);
      }
    }
    return _baseClient!;
  }

  static ResponseFuture<DefaultAuthResponse> login(
      String username, String password, String? totpCode) {
    final stub = getBaseClient();

    return stub.login(
      LoginRequest()
        ..username = username
        ..password = password
        ..totpCode = totpCode ?? "",
    );
  }

  static ResponseFuture<DefaultAuthResponse> register(
      String username, String password) {
    final stub = getBaseClient();
    return stub.register(RegisterRequest()
      ..username = username
      ..password = password);
  }

  static ResponseFuture<LogoutResponse> logout(String refreshToken) {
    final stub = getClient();
    return stub.logout(LogoutRequest()..refreshToken = refreshToken);
  }

  static ResponseFuture<EnableTOTPResponse> enableTOTP(String password) {
    final stub = getClient();
    return stub.enableTOTP(EnableTOTPRequest()..password = password,
        options: CallOptions(metadata: {'authorization': accessToken}));
  }

  static ResponseFuture<VerifyTOTPResponse> verifyTOTP(String totpCode) {
    final stub = getClient();
    return stub.verifyTOTP(VerifyTOTPRequest()..totpCode = totpCode,
        options: CallOptions(metadata: {'authorization': accessToken}));
  }

  static ResponseFuture<DisableTOTPResponse> disableTOTP(
      String password, String totpCode) {
    final stub = getClient();
    return stub.disableTOTP(
        DisableTOTPRequest()
          ..password = password
          ..totpCode = totpCode,
        options: CallOptions(metadata: {'authorization': accessToken}));
  }

  static Future<StatusResponse> status() async {
    final stub = getClient();
    return stub.status(StatusRequest());
  }

  static ResponseFuture<DefaultAuthResponse> refreshToken(String refreshToken) {
    final stub = getClient();
    return stub
        .refreshToken(RefreshTokenRequest()..refreshToken = refreshToken);
  }
}

// Refresh token
Future<void> refreshTheToken() async {
  final storage = new FlutterSecureStorage();
  String refreshToken = await storage.read(key: 'refreshToken') ?? "";
  if (refreshToken == "") {
    return;
  }
  print("REFRESHING");
  final response = await GrpcClient.refreshToken(refreshToken);
  if (response.accessToken != "") {
    await storage.write(key: 'accessToken', value: response.accessToken);
    await storage.write(key: 'refreshToken', value: response.refreshToken);
  }
  print("REFRESHED");
}

// class InterceptorInvocation {
//   final int id;
//   final int unary;
//   final int streaming;

//   InterceptorInvocation(this.id, this.unary, this.streaming);

//   @override
//   String toString() {
//     return '{id: $id, unary: $unary, streaming: $streaming}';
//   }
// }

// class FakeInterceptor implements ClientInterceptor {
//   static String accessToken = "";
//   final int _id;
//   int _unary = 0;
//   int _streaming = 0;

//   static final _invocations = <InterceptorInvocation>[];

//   FakeInterceptor(this._id);

//   @override
//   ResponseFuture<R> interceptUnary<Q, R>(ClientMethod<Q, R> method, Q request,
//       CallOptions options, ClientUnaryInvoker<Q, R> invoker) {
//     _invocations.add(InterceptorInvocation(_id, ++_unary, _streaming));
//     print('FakeInterceptor $_id unary $_unary');
//     return invoker(method, request, _inject(options));
//   }

//   @override
//   ResponseStream<R> interceptStreaming<Q, R>(
//       ClientMethod<Q, R> method,
//       Stream<Q> requests,
//       CallOptions options,
//       ClientStreamingInvoker<Q, R> invoker) {
//     _invocations.add(InterceptorInvocation(_id, _unary, ++_streaming));

//     print("INTERCEPTING STREAMING");

//     final requestStream = _id > 10
//         ? requests.cast<int>().map((req) => req * _id).cast<Q>()
//         : requests;

//     return invoker(method, requestStream, _inject(options));
//   }

//   CallOptions _inject(CallOptions options) {
//     print("INJECTING");
//     return options
//         .mergedWith(CallOptions(metadata: {'authorization': accessToken}));
//     // return options.mergedWith(CallOptions(metadata: {
//     //   'x-interceptor': _invocations.map((i) => i.toString()).join(', '),
//     // }));
//   }

//   static void tearDown() {
//     print("TEARING DOWN");
//     _invocations.clear();
//   }
// }

class AuthenticationInterceptor extends ClientInterceptor {
  FutureOr<void> _provider(Map<String, String> metadata, String uri) async {
    final storage = new FlutterSecureStorage();
    final accesstoken = await storage.read(key: 'accessToken');
    metadata['Authorization'] = accesstoken ?? "";
  }

  @override
  ResponseFuture<R> interceptUnary<Q, R>(
      ClientMethod<Q, R> method, Q request, CallOptions options, invoker) {
    return super.interceptUnary(method, request,
        options.mergedWith(CallOptions(providers: [_provider])), invoker)
      ..catchError((e) async {
        if (e is GrpcError) {
          if (e.code == StatusCode.unauthenticated) {
            print("SHOULD REFRESH TOKEN");
            await refreshTheToken();
            return super.interceptUnary(
                method,
                request,
                options.mergedWith(CallOptions(providers: [_provider])),
                invoker);
          }
        }
      });
  }
}
