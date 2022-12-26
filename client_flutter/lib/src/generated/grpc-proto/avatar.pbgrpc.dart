///
//  Generated code. Do not modify.
//  source: grpc-proto/avatar.proto
//
// @dart = 2.12
// ignore_for_file: annotate_overrides,camel_case_types,constant_identifier_names,directives_ordering,library_prefixes,non_constant_identifier_names,prefer_final_fields,return_of_invalid_type,unnecessary_const,unnecessary_import,unnecessary_this,unused_import,unused_shown_name

import 'dart:async' as $async;

import 'dart:core' as $core;

import 'package:grpc/service_api.dart' as $grpc;
import 'avatar.pb.dart' as $1;
import '../google/protobuf/empty.pb.dart' as $2;
export 'avatar.pb.dart';

class AvatarServiceClient extends $grpc.Client {
  static final _$getUploadURL =
      $grpc.ClientMethod<$1.UploadGetUrlRequest, $1.UploadGetUrlResponse>(
          '/template.AvatarService/GetUploadURL',
          ($1.UploadGetUrlRequest value) => value.writeToBuffer(),
          ($core.List<$core.int> value) =>
              $1.UploadGetUrlResponse.fromBuffer(value));
  static final _$confirmUpload =
      $grpc.ClientMethod<$1.UploadConfirmRequest, $1.UploadConfirmResponse>(
          '/template.AvatarService/ConfirmUpload',
          ($1.UploadConfirmRequest value) => value.writeToBuffer(),
          ($core.List<$core.int> value) =>
              $1.UploadConfirmResponse.fromBuffer(value));
  static final _$tESTUploadImage =
      $grpc.ClientMethod<$1.TESTUploadImageRequest, $1.TESTUploadImageResponse>(
          '/template.AvatarService/TESTUploadImage',
          ($1.TESTUploadImageRequest value) => value.writeToBuffer(),
          ($core.List<$core.int> value) =>
              $1.TESTUploadImageResponse.fromBuffer(value));
  static final _$delete = $grpc.ClientMethod<$2.Empty, $2.Empty>(
      '/template.AvatarService/Delete',
      ($2.Empty value) => value.writeToBuffer(),
      ($core.List<$core.int> value) => $2.Empty.fromBuffer(value));
  static final _$getAvatarView =
      $grpc.ClientMethod<$1.GetAvatarViewRequest, $1.GetAvatarViewResponse>(
          '/template.AvatarService/GetAvatarView',
          ($1.GetAvatarViewRequest value) => value.writeToBuffer(),
          ($core.List<$core.int> value) =>
              $1.GetAvatarViewResponse.fromBuffer(value));

  AvatarServiceClient($grpc.ClientChannel channel,
      {$grpc.CallOptions? options,
      $core.Iterable<$grpc.ClientInterceptor>? interceptors})
      : super(channel, options: options, interceptors: interceptors);

  $grpc.ResponseFuture<$1.UploadGetUrlResponse> getUploadURL(
      $1.UploadGetUrlRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$getUploadURL, request, options: options);
  }

  $grpc.ResponseFuture<$1.UploadConfirmResponse> confirmUpload(
      $1.UploadConfirmRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$confirmUpload, request, options: options);
  }

  $grpc.ResponseFuture<$1.TESTUploadImageResponse> tESTUploadImage(
      $async.Stream<$1.TESTUploadImageRequest> request,
      {$grpc.CallOptions? options}) {
    return $createStreamingCall(_$tESTUploadImage, request, options: options)
        .single;
  }

  $grpc.ResponseFuture<$2.Empty> delete($2.Empty request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$delete, request, options: options);
  }

  $grpc.ResponseFuture<$1.GetAvatarViewResponse> getAvatarView(
      $1.GetAvatarViewRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$getAvatarView, request, options: options);
  }
}

abstract class AvatarServiceBase extends $grpc.Service {
  $core.String get $name => 'template.AvatarService';

  AvatarServiceBase() {
    $addMethod(
        $grpc.ServiceMethod<$1.UploadGetUrlRequest, $1.UploadGetUrlResponse>(
            'GetUploadURL',
            getUploadURL_Pre,
            false,
            false,
            ($core.List<$core.int> value) =>
                $1.UploadGetUrlRequest.fromBuffer(value),
            ($1.UploadGetUrlResponse value) => value.writeToBuffer()));
    $addMethod(
        $grpc.ServiceMethod<$1.UploadConfirmRequest, $1.UploadConfirmResponse>(
            'ConfirmUpload',
            confirmUpload_Pre,
            false,
            false,
            ($core.List<$core.int> value) =>
                $1.UploadConfirmRequest.fromBuffer(value),
            ($1.UploadConfirmResponse value) => value.writeToBuffer()));
    $addMethod($grpc.ServiceMethod<$1.TESTUploadImageRequest,
            $1.TESTUploadImageResponse>(
        'TESTUploadImage',
        tESTUploadImage,
        true,
        false,
        ($core.List<$core.int> value) =>
            $1.TESTUploadImageRequest.fromBuffer(value),
        ($1.TESTUploadImageResponse value) => value.writeToBuffer()));
    $addMethod($grpc.ServiceMethod<$2.Empty, $2.Empty>(
        'Delete',
        delete_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $2.Empty.fromBuffer(value),
        ($2.Empty value) => value.writeToBuffer()));
    $addMethod(
        $grpc.ServiceMethod<$1.GetAvatarViewRequest, $1.GetAvatarViewResponse>(
            'GetAvatarView',
            getAvatarView_Pre,
            false,
            false,
            ($core.List<$core.int> value) =>
                $1.GetAvatarViewRequest.fromBuffer(value),
            ($1.GetAvatarViewResponse value) => value.writeToBuffer()));
  }

  $async.Future<$1.UploadGetUrlResponse> getUploadURL_Pre(
      $grpc.ServiceCall call,
      $async.Future<$1.UploadGetUrlRequest> request) async {
    return getUploadURL(call, await request);
  }

  $async.Future<$1.UploadConfirmResponse> confirmUpload_Pre(
      $grpc.ServiceCall call,
      $async.Future<$1.UploadConfirmRequest> request) async {
    return confirmUpload(call, await request);
  }

  $async.Future<$2.Empty> delete_Pre(
      $grpc.ServiceCall call, $async.Future<$2.Empty> request) async {
    return delete(call, await request);
  }

  $async.Future<$1.GetAvatarViewResponse> getAvatarView_Pre(
      $grpc.ServiceCall call,
      $async.Future<$1.GetAvatarViewRequest> request) async {
    return getAvatarView(call, await request);
  }

  $async.Future<$1.UploadGetUrlResponse> getUploadURL(
      $grpc.ServiceCall call, $1.UploadGetUrlRequest request);
  $async.Future<$1.UploadConfirmResponse> confirmUpload(
      $grpc.ServiceCall call, $1.UploadConfirmRequest request);
  $async.Future<$1.TESTUploadImageResponse> tESTUploadImage(
      $grpc.ServiceCall call, $async.Stream<$1.TESTUploadImageRequest> request);
  $async.Future<$2.Empty> delete($grpc.ServiceCall call, $2.Empty request);
  $async.Future<$1.GetAvatarViewResponse> getAvatarView(
      $grpc.ServiceCall call, $1.GetAvatarViewRequest request);
}
