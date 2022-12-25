///
//  Generated code. Do not modify.
//  source: grpc-proto/auth.proto
//
// @dart = 2.12
// ignore_for_file: annotate_overrides,camel_case_types,constant_identifier_names,directives_ordering,library_prefixes,non_constant_identifier_names,prefer_final_fields,return_of_invalid_type,unnecessary_const,unnecessary_import,unnecessary_this,unused_import,unused_shown_name

import 'dart:async' as $async;

import 'dart:core' as $core;

import 'package:grpc/service_api.dart' as $grpc;
import 'auth.pb.dart' as $0;
export 'auth.pb.dart';

class AuthServiceClient extends $grpc.Client {
  static final _$login =
      $grpc.ClientMethod<$0.LoginRequest, $0.DefaultAuthResponse>(
          '/template.AuthService/Login',
          ($0.LoginRequest value) => value.writeToBuffer(),
          ($core.List<$core.int> value) =>
              $0.DefaultAuthResponse.fromBuffer(value));
  static final _$refreshToken =
      $grpc.ClientMethod<$0.RefreshTokenRequest, $0.DefaultAuthResponse>(
          '/template.AuthService/RefreshToken',
          ($0.RefreshTokenRequest value) => value.writeToBuffer(),
          ($core.List<$core.int> value) =>
              $0.DefaultAuthResponse.fromBuffer(value));
  static final _$logout =
      $grpc.ClientMethod<$0.LogoutRequest, $0.LogoutResponse>(
          '/template.AuthService/Logout',
          ($0.LogoutRequest value) => value.writeToBuffer(),
          ($core.List<$core.int> value) => $0.LogoutResponse.fromBuffer(value));
  static final _$register =
      $grpc.ClientMethod<$0.RegisterRequest, $0.DefaultAuthResponse>(
          '/template.AuthService/Register',
          ($0.RegisterRequest value) => value.writeToBuffer(),
          ($core.List<$core.int> value) =>
              $0.DefaultAuthResponse.fromBuffer(value));
  static final _$status =
      $grpc.ClientMethod<$0.StatusRequest, $0.StatusResponse>(
          '/template.AuthService/Status',
          ($0.StatusRequest value) => value.writeToBuffer(),
          ($core.List<$core.int> value) => $0.StatusResponse.fromBuffer(value));
  static final _$disableTOTP =
      $grpc.ClientMethod<$0.DisableTOTPRequest, $0.DisableTOTPResponse>(
          '/template.AuthService/DisableTOTP',
          ($0.DisableTOTPRequest value) => value.writeToBuffer(),
          ($core.List<$core.int> value) =>
              $0.DisableTOTPResponse.fromBuffer(value));
  static final _$enableTOTP =
      $grpc.ClientMethod<$0.EnableTOTPRequest, $0.EnableTOTPResponse>(
          '/template.AuthService/EnableTOTP',
          ($0.EnableTOTPRequest value) => value.writeToBuffer(),
          ($core.List<$core.int> value) =>
              $0.EnableTOTPResponse.fromBuffer(value));
  static final _$verifyTOTP =
      $grpc.ClientMethod<$0.VerifyTOTPRequest, $0.VerifyTOTPResponse>(
          '/template.AuthService/VerifyTOTP',
          ($0.VerifyTOTPRequest value) => value.writeToBuffer(),
          ($core.List<$core.int> value) =>
              $0.VerifyTOTPResponse.fromBuffer(value));

  AuthServiceClient($grpc.ClientChannel channel,
      {$grpc.CallOptions? options,
      $core.Iterable<$grpc.ClientInterceptor>? interceptors})
      : super(channel, options: options, interceptors: interceptors);

  $grpc.ResponseFuture<$0.DefaultAuthResponse> login($0.LoginRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$login, request, options: options);
  }

  $grpc.ResponseFuture<$0.DefaultAuthResponse> refreshToken(
      $0.RefreshTokenRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$refreshToken, request, options: options);
  }

  $grpc.ResponseFuture<$0.LogoutResponse> logout($0.LogoutRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$logout, request, options: options);
  }

  $grpc.ResponseFuture<$0.DefaultAuthResponse> register(
      $0.RegisterRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$register, request, options: options);
  }

  $grpc.ResponseFuture<$0.StatusResponse> status($0.StatusRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$status, request, options: options);
  }

  $grpc.ResponseFuture<$0.DisableTOTPResponse> disableTOTP(
      $0.DisableTOTPRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$disableTOTP, request, options: options);
  }

  $grpc.ResponseFuture<$0.EnableTOTPResponse> enableTOTP(
      $0.EnableTOTPRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$enableTOTP, request, options: options);
  }

  $grpc.ResponseFuture<$0.VerifyTOTPResponse> verifyTOTP(
      $0.VerifyTOTPRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$verifyTOTP, request, options: options);
  }
}

abstract class AuthServiceBase extends $grpc.Service {
  $core.String get $name => 'template.AuthService';

  AuthServiceBase() {
    $addMethod($grpc.ServiceMethod<$0.LoginRequest, $0.DefaultAuthResponse>(
        'Login',
        login_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $0.LoginRequest.fromBuffer(value),
        ($0.DefaultAuthResponse value) => value.writeToBuffer()));
    $addMethod(
        $grpc.ServiceMethod<$0.RefreshTokenRequest, $0.DefaultAuthResponse>(
            'RefreshToken',
            refreshToken_Pre,
            false,
            false,
            ($core.List<$core.int> value) =>
                $0.RefreshTokenRequest.fromBuffer(value),
            ($0.DefaultAuthResponse value) => value.writeToBuffer()));
    $addMethod($grpc.ServiceMethod<$0.LogoutRequest, $0.LogoutResponse>(
        'Logout',
        logout_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $0.LogoutRequest.fromBuffer(value),
        ($0.LogoutResponse value) => value.writeToBuffer()));
    $addMethod($grpc.ServiceMethod<$0.RegisterRequest, $0.DefaultAuthResponse>(
        'Register',
        register_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $0.RegisterRequest.fromBuffer(value),
        ($0.DefaultAuthResponse value) => value.writeToBuffer()));
    $addMethod($grpc.ServiceMethod<$0.StatusRequest, $0.StatusResponse>(
        'Status',
        status_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $0.StatusRequest.fromBuffer(value),
        ($0.StatusResponse value) => value.writeToBuffer()));
    $addMethod(
        $grpc.ServiceMethod<$0.DisableTOTPRequest, $0.DisableTOTPResponse>(
            'DisableTOTP',
            disableTOTP_Pre,
            false,
            false,
            ($core.List<$core.int> value) =>
                $0.DisableTOTPRequest.fromBuffer(value),
            ($0.DisableTOTPResponse value) => value.writeToBuffer()));
    $addMethod($grpc.ServiceMethod<$0.EnableTOTPRequest, $0.EnableTOTPResponse>(
        'EnableTOTP',
        enableTOTP_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $0.EnableTOTPRequest.fromBuffer(value),
        ($0.EnableTOTPResponse value) => value.writeToBuffer()));
    $addMethod($grpc.ServiceMethod<$0.VerifyTOTPRequest, $0.VerifyTOTPResponse>(
        'VerifyTOTP',
        verifyTOTP_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $0.VerifyTOTPRequest.fromBuffer(value),
        ($0.VerifyTOTPResponse value) => value.writeToBuffer()));
  }

  $async.Future<$0.DefaultAuthResponse> login_Pre(
      $grpc.ServiceCall call, $async.Future<$0.LoginRequest> request) async {
    return login(call, await request);
  }

  $async.Future<$0.DefaultAuthResponse> refreshToken_Pre($grpc.ServiceCall call,
      $async.Future<$0.RefreshTokenRequest> request) async {
    return refreshToken(call, await request);
  }

  $async.Future<$0.LogoutResponse> logout_Pre(
      $grpc.ServiceCall call, $async.Future<$0.LogoutRequest> request) async {
    return logout(call, await request);
  }

  $async.Future<$0.DefaultAuthResponse> register_Pre(
      $grpc.ServiceCall call, $async.Future<$0.RegisterRequest> request) async {
    return register(call, await request);
  }

  $async.Future<$0.StatusResponse> status_Pre(
      $grpc.ServiceCall call, $async.Future<$0.StatusRequest> request) async {
    return status(call, await request);
  }

  $async.Future<$0.DisableTOTPResponse> disableTOTP_Pre($grpc.ServiceCall call,
      $async.Future<$0.DisableTOTPRequest> request) async {
    return disableTOTP(call, await request);
  }

  $async.Future<$0.EnableTOTPResponse> enableTOTP_Pre($grpc.ServiceCall call,
      $async.Future<$0.EnableTOTPRequest> request) async {
    return enableTOTP(call, await request);
  }

  $async.Future<$0.VerifyTOTPResponse> verifyTOTP_Pre($grpc.ServiceCall call,
      $async.Future<$0.VerifyTOTPRequest> request) async {
    return verifyTOTP(call, await request);
  }

  $async.Future<$0.DefaultAuthResponse> login(
      $grpc.ServiceCall call, $0.LoginRequest request);
  $async.Future<$0.DefaultAuthResponse> refreshToken(
      $grpc.ServiceCall call, $0.RefreshTokenRequest request);
  $async.Future<$0.LogoutResponse> logout(
      $grpc.ServiceCall call, $0.LogoutRequest request);
  $async.Future<$0.DefaultAuthResponse> register(
      $grpc.ServiceCall call, $0.RegisterRequest request);
  $async.Future<$0.StatusResponse> status(
      $grpc.ServiceCall call, $0.StatusRequest request);
  $async.Future<$0.DisableTOTPResponse> disableTOTP(
      $grpc.ServiceCall call, $0.DisableTOTPRequest request);
  $async.Future<$0.EnableTOTPResponse> enableTOTP(
      $grpc.ServiceCall call, $0.EnableTOTPRequest request);
  $async.Future<$0.VerifyTOTPResponse> verifyTOTP(
      $grpc.ServiceCall call, $0.VerifyTOTPRequest request);
}
