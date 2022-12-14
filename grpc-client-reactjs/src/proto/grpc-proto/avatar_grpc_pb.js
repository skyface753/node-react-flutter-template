// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var grpc$proto_avatar_pb = require('../grpc-proto/avatar_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_GetAvatarViewRequest(arg) {
  if (!(arg instanceof grpc$proto_avatar_pb.GetAvatarViewRequest)) {
    throw new Error('Expected argument of type template.GetAvatarViewRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_GetAvatarViewRequest(buffer_arg) {
  return grpc$proto_avatar_pb.GetAvatarViewRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_GetAvatarViewResponse(arg) {
  if (!(arg instanceof grpc$proto_avatar_pb.GetAvatarViewResponse)) {
    throw new Error('Expected argument of type template.GetAvatarViewResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_GetAvatarViewResponse(buffer_arg) {
  return grpc$proto_avatar_pb.GetAvatarViewResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_TESTUploadImageRequest(arg) {
  if (!(arg instanceof grpc$proto_avatar_pb.TESTUploadImageRequest)) {
    throw new Error('Expected argument of type template.TESTUploadImageRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_TESTUploadImageRequest(buffer_arg) {
  return grpc$proto_avatar_pb.TESTUploadImageRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_TESTUploadImageResponse(arg) {
  if (!(arg instanceof grpc$proto_avatar_pb.TESTUploadImageResponse)) {
    throw new Error('Expected argument of type template.TESTUploadImageResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_TESTUploadImageResponse(buffer_arg) {
  return grpc$proto_avatar_pb.TESTUploadImageResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_UploadConfirmRequest(arg) {
  if (!(arg instanceof grpc$proto_avatar_pb.UploadConfirmRequest)) {
    throw new Error('Expected argument of type template.UploadConfirmRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_UploadConfirmRequest(buffer_arg) {
  return grpc$proto_avatar_pb.UploadConfirmRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_UploadConfirmResponse(arg) {
  if (!(arg instanceof grpc$proto_avatar_pb.UploadConfirmResponse)) {
    throw new Error('Expected argument of type template.UploadConfirmResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_UploadConfirmResponse(buffer_arg) {
  return grpc$proto_avatar_pb.UploadConfirmResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_UploadGetUrlRequest(arg) {
  if (!(arg instanceof grpc$proto_avatar_pb.UploadGetUrlRequest)) {
    throw new Error('Expected argument of type template.UploadGetUrlRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_UploadGetUrlRequest(buffer_arg) {
  return grpc$proto_avatar_pb.UploadGetUrlRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_UploadGetUrlResponse(arg) {
  if (!(arg instanceof grpc$proto_avatar_pb.UploadGetUrlResponse)) {
    throw new Error('Expected argument of type template.UploadGetUrlResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_UploadGetUrlResponse(buffer_arg) {
  return grpc$proto_avatar_pb.UploadGetUrlResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var AvatarServiceService = exports.AvatarServiceService = {
  // rpc RequestAUploadURL(UploadUrlRequest) returns (UploadUrlResponse);
getUploadURL: {
    path: '/template.AvatarService/GetUploadURL',
    requestStream: false,
    responseStream: false,
    requestType: grpc$proto_avatar_pb.UploadGetUrlRequest,
    responseType: grpc$proto_avatar_pb.UploadGetUrlResponse,
    requestSerialize: serialize_template_UploadGetUrlRequest,
    requestDeserialize: deserialize_template_UploadGetUrlRequest,
    responseSerialize: serialize_template_UploadGetUrlResponse,
    responseDeserialize: deserialize_template_UploadGetUrlResponse,
  },
  confirmUpload: {
    path: '/template.AvatarService/ConfirmUpload',
    requestStream: false,
    responseStream: false,
    requestType: grpc$proto_avatar_pb.UploadConfirmRequest,
    responseType: grpc$proto_avatar_pb.UploadConfirmResponse,
    requestSerialize: serialize_template_UploadConfirmRequest,
    requestDeserialize: deserialize_template_UploadConfirmRequest,
    responseSerialize: serialize_template_UploadConfirmResponse,
    responseDeserialize: deserialize_template_UploadConfirmResponse,
  },
  tESTUploadImage: {
    path: '/template.AvatarService/TESTUploadImage',
    requestStream: true,
    responseStream: false,
    requestType: grpc$proto_avatar_pb.TESTUploadImageRequest,
    responseType: grpc$proto_avatar_pb.TESTUploadImageResponse,
    requestSerialize: serialize_template_TESTUploadImageRequest,
    requestDeserialize: deserialize_template_TESTUploadImageRequest,
    responseSerialize: serialize_template_TESTUploadImageResponse,
    responseDeserialize: deserialize_template_TESTUploadImageResponse,
  },
  delete: {
    path: '/template.AvatarService/Delete',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  getAvatarView: {
    path: '/template.AvatarService/GetAvatarView',
    requestStream: false,
    responseStream: false,
    requestType: grpc$proto_avatar_pb.GetAvatarViewRequest,
    responseType: grpc$proto_avatar_pb.GetAvatarViewResponse,
    requestSerialize: serialize_template_GetAvatarViewRequest,
    requestDeserialize: deserialize_template_GetAvatarViewRequest,
    responseSerialize: serialize_template_GetAvatarViewResponse,
    responseDeserialize: deserialize_template_GetAvatarViewResponse,
  },
};

exports.AvatarServiceClient = grpc.makeGenericClientConstructor(AvatarServiceService);
