///
//  Generated code. Do not modify.
//  source: grpc-proto/avatar.proto
//
// @dart = 2.12
// ignore_for_file: annotate_overrides,camel_case_types,constant_identifier_names,deprecated_member_use_from_same_package,directives_ordering,library_prefixes,non_constant_identifier_names,prefer_final_fields,return_of_invalid_type,unnecessary_const,unnecessary_import,unnecessary_this,unused_import,unused_shown_name

import 'dart:core' as $core;
import 'dart:convert' as $convert;
import 'dart:typed_data' as $typed_data;
@$core.Deprecated('Use avatarDescriptor instead')
const Avatar$json = const {
  '1': 'Avatar',
  '2': const [
    const {'1': 'generatedPath', '3': 1, '4': 1, '5': 9, '10': 'generatedPath'},
    const {'1': 'originalName', '3': 2, '4': 1, '5': 9, '10': 'originalName'},
    const {'1': 'type', '3': 3, '4': 1, '5': 9, '10': 'type'},
  ],
};

/// Descriptor for `Avatar`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List avatarDescriptor = $convert.base64Decode('CgZBdmF0YXISJAoNZ2VuZXJhdGVkUGF0aBgBIAEoCVINZ2VuZXJhdGVkUGF0aBIiCgxvcmlnaW5hbE5hbWUYAiABKAlSDG9yaWdpbmFsTmFtZRISCgR0eXBlGAMgASgJUgR0eXBl');
@$core.Deprecated('Use uploadGetUrlRequestDescriptor instead')
const UploadGetUrlRequest$json = const {
  '1': 'UploadGetUrlRequest',
  '2': const [
    const {'1': 'filename', '3': 1, '4': 1, '5': 9, '10': 'filename'},
  ],
};

/// Descriptor for `UploadGetUrlRequest`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List uploadGetUrlRequestDescriptor = $convert.base64Decode('ChNVcGxvYWRHZXRVcmxSZXF1ZXN0EhoKCGZpbGVuYW1lGAEgASgJUghmaWxlbmFtZQ==');
@$core.Deprecated('Use uploadGetUrlResponseDescriptor instead')
const UploadGetUrlResponse$json = const {
  '1': 'UploadGetUrlResponse',
  '2': const [
    const {'1': 'url', '3': 1, '4': 1, '5': 9, '10': 'url'},
    const {'1': 'tokenToConfirm', '3': 2, '4': 1, '5': 9, '10': 'tokenToConfirm'},
  ],
};

/// Descriptor for `UploadGetUrlResponse`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List uploadGetUrlResponseDescriptor = $convert.base64Decode('ChRVcGxvYWRHZXRVcmxSZXNwb25zZRIQCgN1cmwYASABKAlSA3VybBImCg50b2tlblRvQ29uZmlybRgCIAEoCVIOdG9rZW5Ub0NvbmZpcm0=');
@$core.Deprecated('Use uploadConfirmRequestDescriptor instead')
const UploadConfirmRequest$json = const {
  '1': 'UploadConfirmRequest',
  '2': const [
    const {'1': 'token', '3': 1, '4': 1, '5': 9, '10': 'token'},
  ],
};

/// Descriptor for `UploadConfirmRequest`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List uploadConfirmRequestDescriptor = $convert.base64Decode('ChRVcGxvYWRDb25maXJtUmVxdWVzdBIUCgV0b2tlbhgBIAEoCVIFdG9rZW4=');
@$core.Deprecated('Use uploadConfirmResponseDescriptor instead')
const UploadConfirmResponse$json = const {
  '1': 'UploadConfirmResponse',
  '2': const [
    const {'1': 'url', '3': 1, '4': 1, '5': 9, '10': 'url'},
  ],
};

/// Descriptor for `UploadConfirmResponse`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List uploadConfirmResponseDescriptor = $convert.base64Decode('ChVVcGxvYWRDb25maXJtUmVzcG9uc2USEAoDdXJsGAEgASgJUgN1cmw=');
@$core.Deprecated('Use getAvatarViewRequestDescriptor instead')
const GetAvatarViewRequest$json = const {
  '1': 'GetAvatarViewRequest',
  '2': const [
    const {'1': 'userId', '3': 1, '4': 1, '5': 5, '10': 'userId'},
  ],
};

/// Descriptor for `GetAvatarViewRequest`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List getAvatarViewRequestDescriptor = $convert.base64Decode('ChRHZXRBdmF0YXJWaWV3UmVxdWVzdBIWCgZ1c2VySWQYASABKAVSBnVzZXJJZA==');
@$core.Deprecated('Use getAvatarViewResponseDescriptor instead')
const GetAvatarViewResponse$json = const {
  '1': 'GetAvatarViewResponse',
  '2': const [
    const {'1': 'url', '3': 1, '4': 1, '5': 9, '10': 'url'},
  ],
};

/// Descriptor for `GetAvatarViewResponse`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List getAvatarViewResponseDescriptor = $convert.base64Decode('ChVHZXRBdmF0YXJWaWV3UmVzcG9uc2USEAoDdXJsGAEgASgJUgN1cmw=');
@$core.Deprecated('Use tESTUploadImageRequestDescriptor instead')
const TESTUploadImageRequest$json = const {
  '1': 'TESTUploadImageRequest',
  '2': const [
    const {'1': 'info', '3': 1, '4': 1, '5': 11, '6': '.template.TESTImageInfo', '9': 0, '10': 'info'},
    const {'1': 'chunk_data', '3': 2, '4': 1, '5': 12, '9': 0, '10': 'chunkData'},
  ],
  '8': const [
    const {'1': 'data'},
  ],
};

/// Descriptor for `TESTUploadImageRequest`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List tESTUploadImageRequestDescriptor = $convert.base64Decode('ChZURVNUVXBsb2FkSW1hZ2VSZXF1ZXN0Ei0KBGluZm8YASABKAsyFy50ZW1wbGF0ZS5URVNUSW1hZ2VJbmZvSABSBGluZm8SHwoKY2h1bmtfZGF0YRgCIAEoDEgAUgljaHVua0RhdGFCBgoEZGF0YQ==');
@$core.Deprecated('Use tESTImageInfoDescriptor instead')
const TESTImageInfo$json = const {
  '1': 'TESTImageInfo',
  '2': const [
    const {'1': 'type', '3': 1, '4': 1, '5': 9, '10': 'type'},
    const {'1': 'filename', '3': 2, '4': 1, '5': 9, '10': 'filename'},
  ],
};

/// Descriptor for `TESTImageInfo`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List tESTImageInfoDescriptor = $convert.base64Decode('Cg1URVNUSW1hZ2VJbmZvEhIKBHR5cGUYASABKAlSBHR5cGUSGgoIZmlsZW5hbWUYAiABKAlSCGZpbGVuYW1l');
@$core.Deprecated('Use tESTUploadImageResponseDescriptor instead')
const TESTUploadImageResponse$json = const {
  '1': 'TESTUploadImageResponse',
  '2': const [
    const {'1': 'generatedPath', '3': 1, '4': 1, '5': 9, '10': 'generatedPath'},
  ],
};

/// Descriptor for `TESTUploadImageResponse`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List tESTUploadImageResponseDescriptor = $convert.base64Decode('ChdURVNUVXBsb2FkSW1hZ2VSZXNwb25zZRIkCg1nZW5lcmF0ZWRQYXRoGAEgASgJUg1nZW5lcmF0ZWRQYXRo');
