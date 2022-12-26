///
//  Generated code. Do not modify.
//  source: grpc-proto/auth.proto
//
// @dart = 2.12
// ignore_for_file: annotate_overrides,camel_case_types,constant_identifier_names,deprecated_member_use_from_same_package,directives_ordering,library_prefixes,non_constant_identifier_names,prefer_final_fields,return_of_invalid_type,unnecessary_const,unnecessary_import,unnecessary_this,unused_import,unused_shown_name

import 'dart:core' as $core;
import 'dart:convert' as $convert;
import 'dart:typed_data' as $typed_data;
@$core.Deprecated('Use roleDescriptor instead')
const Role$json = const {
  '1': 'Role',
  '2': const [
    const {'1': 'USER', '2': 0},
    const {'1': 'ADMIN', '2': 1},
  ],
};

/// Descriptor for `Role`. Decode as a `google.protobuf.EnumDescriptorProto`.
final $typed_data.Uint8List roleDescriptor = $convert.base64Decode('CgRSb2xlEggKBFVTRVIQABIJCgVBRE1JThAB');
@$core.Deprecated('Use userDescriptor instead')
const User$json = const {
  '1': 'User',
  '2': const [
    const {'1': 'id', '3': 1, '4': 1, '5': 5, '10': 'id'},
    const {'1': 'username', '3': 2, '4': 1, '5': 9, '10': 'username'},
    const {'1': 'role', '3': 5, '4': 1, '5': 14, '6': '.template.Role', '10': 'role'},
    const {'1': 'avatar', '3': 6, '4': 1, '5': 9, '10': 'avatar'},
    const {'1': 'created_at', '3': 7, '4': 1, '5': 11, '6': '.google.protobuf.Timestamp', '10': 'createdAt'},
    const {'1': 'updated_at', '3': 8, '4': 1, '5': 11, '6': '.google.protobuf.Timestamp', '10': 'updatedAt'},
  ],
};

/// Descriptor for `User`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List userDescriptor = $convert.base64Decode('CgRVc2VyEg4KAmlkGAEgASgFUgJpZBIaCgh1c2VybmFtZRgCIAEoCVIIdXNlcm5hbWUSIgoEcm9sZRgFIAEoDjIOLnRlbXBsYXRlLlJvbGVSBHJvbGUSFgoGYXZhdGFyGAYgASgJUgZhdmF0YXISOQoKY3JlYXRlZF9hdBgHIAEoCzIaLmdvb2dsZS5wcm90b2J1Zi5UaW1lc3RhbXBSCWNyZWF0ZWRBdBI5Cgp1cGRhdGVkX2F0GAggASgLMhouZ29vZ2xlLnByb3RvYnVmLlRpbWVzdGFtcFIJdXBkYXRlZEF0');
@$core.Deprecated('Use loginRequestDescriptor instead')
const LoginRequest$json = const {
  '1': 'LoginRequest',
  '2': const [
    const {'1': 'username', '3': 1, '4': 1, '5': 9, '10': 'username'},
    const {'1': 'password', '3': 2, '4': 1, '5': 9, '10': 'password'},
    const {'1': 'totpCode', '3': 3, '4': 1, '5': 9, '9': 0, '10': 'totpCode', '17': true},
  ],
  '8': const [
    const {'1': '_totpCode'},
  ],
};

/// Descriptor for `LoginRequest`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List loginRequestDescriptor = $convert.base64Decode('CgxMb2dpblJlcXVlc3QSGgoIdXNlcm5hbWUYASABKAlSCHVzZXJuYW1lEhoKCHBhc3N3b3JkGAIgASgJUghwYXNzd29yZBIfCgh0b3RwQ29kZRgDIAEoCUgAUgh0b3RwQ29kZYgBAUILCglfdG90cENvZGU=');
@$core.Deprecated('Use refreshTokenRequestDescriptor instead')
const RefreshTokenRequest$json = const {
  '1': 'RefreshTokenRequest',
  '2': const [
    const {'1': 'refresh_token', '3': 1, '4': 1, '5': 9, '10': 'refreshToken'},
  ],
};

/// Descriptor for `RefreshTokenRequest`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List refreshTokenRequestDescriptor = $convert.base64Decode('ChNSZWZyZXNoVG9rZW5SZXF1ZXN0EiMKDXJlZnJlc2hfdG9rZW4YASABKAlSDHJlZnJlc2hUb2tlbg==');
@$core.Deprecated('Use logoutRequestDescriptor instead')
const LogoutRequest$json = const {
  '1': 'LogoutRequest',
  '2': const [
    const {'1': 'refresh_token', '3': 1, '4': 1, '5': 9, '10': 'refreshToken'},
  ],
};

/// Descriptor for `LogoutRequest`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List logoutRequestDescriptor = $convert.base64Decode('Cg1Mb2dvdXRSZXF1ZXN0EiMKDXJlZnJlc2hfdG9rZW4YASABKAlSDHJlZnJlc2hUb2tlbg==');
@$core.Deprecated('Use logoutResponseDescriptor instead')
const LogoutResponse$json = const {
  '1': 'LogoutResponse',
  '2': const [
    const {'1': 'success', '3': 1, '4': 1, '5': 8, '10': 'success'},
  ],
};

/// Descriptor for `LogoutResponse`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List logoutResponseDescriptor = $convert.base64Decode('Cg5Mb2dvdXRSZXNwb25zZRIYCgdzdWNjZXNzGAEgASgIUgdzdWNjZXNz');
@$core.Deprecated('Use registerRequestDescriptor instead')
const RegisterRequest$json = const {
  '1': 'RegisterRequest',
  '2': const [
    const {'1': 'username', '3': 1, '4': 1, '5': 9, '10': 'username'},
    const {'1': 'password', '3': 2, '4': 1, '5': 9, '10': 'password'},
  ],
};

/// Descriptor for `RegisterRequest`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List registerRequestDescriptor = $convert.base64Decode('Cg9SZWdpc3RlclJlcXVlc3QSGgoIdXNlcm5hbWUYASABKAlSCHVzZXJuYW1lEhoKCHBhc3N3b3JkGAIgASgJUghwYXNzd29yZA==');
@$core.Deprecated('Use defaultAuthResponseDescriptor instead')
const DefaultAuthResponse$json = const {
  '1': 'DefaultAuthResponse',
  '2': const [
    const {'1': 'access_token', '3': 1, '4': 1, '5': 9, '10': 'accessToken'},
    const {'1': 'refresh_token', '3': 2, '4': 1, '5': 9, '10': 'refreshToken'},
    const {'1': 'csrf_token', '3': 3, '4': 1, '5': 9, '10': 'csrfToken'},
    const {'1': 'user', '3': 4, '4': 1, '5': 11, '6': '.template.User', '10': 'user'},
  ],
};

/// Descriptor for `DefaultAuthResponse`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List defaultAuthResponseDescriptor = $convert.base64Decode('ChNEZWZhdWx0QXV0aFJlc3BvbnNlEiEKDGFjY2Vzc190b2tlbhgBIAEoCVILYWNjZXNzVG9rZW4SIwoNcmVmcmVzaF90b2tlbhgCIAEoCVIMcmVmcmVzaFRva2VuEh0KCmNzcmZfdG9rZW4YAyABKAlSCWNzcmZUb2tlbhIiCgR1c2VyGAQgASgLMg4udGVtcGxhdGUuVXNlclIEdXNlcg==');
@$core.Deprecated('Use disableTOTPRequestDescriptor instead')
const DisableTOTPRequest$json = const {
  '1': 'DisableTOTPRequest',
  '2': const [
    const {'1': 'password', '3': 1, '4': 1, '5': 9, '10': 'password'},
    const {'1': 'totpCode', '3': 2, '4': 1, '5': 9, '10': 'totpCode'},
  ],
};

/// Descriptor for `DisableTOTPRequest`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List disableTOTPRequestDescriptor = $convert.base64Decode('ChJEaXNhYmxlVE9UUFJlcXVlc3QSGgoIcGFzc3dvcmQYASABKAlSCHBhc3N3b3JkEhoKCHRvdHBDb2RlGAIgASgJUgh0b3RwQ29kZQ==');
@$core.Deprecated('Use disableTOTPResponseDescriptor instead')
const DisableTOTPResponse$json = const {
  '1': 'DisableTOTPResponse',
  '2': const [
    const {'1': 'success', '3': 1, '4': 1, '5': 8, '10': 'success'},
  ],
};

/// Descriptor for `DisableTOTPResponse`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List disableTOTPResponseDescriptor = $convert.base64Decode('ChNEaXNhYmxlVE9UUFJlc3BvbnNlEhgKB3N1Y2Nlc3MYASABKAhSB3N1Y2Nlc3M=');
@$core.Deprecated('Use enableTOTPRequestDescriptor instead')
const EnableTOTPRequest$json = const {
  '1': 'EnableTOTPRequest',
  '2': const [
    const {'1': 'password', '3': 1, '4': 1, '5': 9, '10': 'password'},
  ],
};

/// Descriptor for `EnableTOTPRequest`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List enableTOTPRequestDescriptor = $convert.base64Decode('ChFFbmFibGVUT1RQUmVxdWVzdBIaCghwYXNzd29yZBgBIAEoCVIIcGFzc3dvcmQ=');
@$core.Deprecated('Use enableTOTPResponseDescriptor instead')
const EnableTOTPResponse$json = const {
  '1': 'EnableTOTPResponse',
  '2': const [
    const {'1': 'secret', '3': 1, '4': 1, '5': 9, '10': 'secret'},
    const {'1': 'url', '3': 2, '4': 1, '5': 9, '10': 'url'},
  ],
};

/// Descriptor for `EnableTOTPResponse`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List enableTOTPResponseDescriptor = $convert.base64Decode('ChJFbmFibGVUT1RQUmVzcG9uc2USFgoGc2VjcmV0GAEgASgJUgZzZWNyZXQSEAoDdXJsGAIgASgJUgN1cmw=');
@$core.Deprecated('Use verifyTOTPRequestDescriptor instead')
const VerifyTOTPRequest$json = const {
  '1': 'VerifyTOTPRequest',
  '2': const [
    const {'1': 'totpCode', '3': 1, '4': 1, '5': 9, '10': 'totpCode'},
  ],
};

/// Descriptor for `VerifyTOTPRequest`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List verifyTOTPRequestDescriptor = $convert.base64Decode('ChFWZXJpZnlUT1RQUmVxdWVzdBIaCgh0b3RwQ29kZRgBIAEoCVIIdG90cENvZGU=');
@$core.Deprecated('Use verifyTOTPResponseDescriptor instead')
const VerifyTOTPResponse$json = const {
  '1': 'VerifyTOTPResponse',
  '2': const [
    const {'1': 'success', '3': 1, '4': 1, '5': 8, '10': 'success'},
  ],
};

/// Descriptor for `VerifyTOTPResponse`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List verifyTOTPResponseDescriptor = $convert.base64Decode('ChJWZXJpZnlUT1RQUmVzcG9uc2USGAoHc3VjY2VzcxgBIAEoCFIHc3VjY2Vzcw==');
@$core.Deprecated('Use statusRequestDescriptor instead')
const StatusRequest$json = const {
  '1': 'StatusRequest',
  '2': const [
    const {'1': 'access_token', '3': 1, '4': 1, '5': 9, '10': 'accessToken'},
  ],
};

/// Descriptor for `StatusRequest`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List statusRequestDescriptor = $convert.base64Decode('Cg1TdGF0dXNSZXF1ZXN0EiEKDGFjY2Vzc190b2tlbhgBIAEoCVILYWNjZXNzVG9rZW4=');
@$core.Deprecated('Use statusResponseDescriptor instead')
const StatusResponse$json = const {
  '1': 'StatusResponse',
  '2': const [
    const {'1': 'user', '3': 1, '4': 1, '5': 11, '6': '.template.User', '10': 'user'},
    const {'1': 'totpEnabled', '3': 2, '4': 1, '5': 8, '10': 'totpEnabled'},
  ],
};

/// Descriptor for `StatusResponse`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List statusResponseDescriptor = $convert.base64Decode('Cg5TdGF0dXNSZXNwb25zZRIiCgR1c2VyGAEgASgLMg4udGVtcGxhdGUuVXNlclIEdXNlchIgCgt0b3RwRW5hYmxlZBgCIAEoCFILdG90cEVuYWJsZWQ=');
