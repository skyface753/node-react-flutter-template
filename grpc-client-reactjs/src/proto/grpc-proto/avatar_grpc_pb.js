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

function serialize_template_ConfirmUploadRequest(arg) {
  if (!(arg instanceof grpc$proto_avatar_pb.ConfirmUploadRequest)) {
    throw new Error('Expected argument of type template.ConfirmUploadRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_ConfirmUploadRequest(buffer_arg) {
  return grpc$proto_avatar_pb.ConfirmUploadRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_ConfirmUploadResponse(arg) {
  if (!(arg instanceof grpc$proto_avatar_pb.ConfirmUploadResponse)) {
    throw new Error('Expected argument of type template.ConfirmUploadResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_ConfirmUploadResponse(buffer_arg) {
  return grpc$proto_avatar_pb.ConfirmUploadResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_template_UploadImageRequest(arg) {
  if (!(arg instanceof grpc$proto_avatar_pb.UploadImageRequest)) {
    throw new Error('Expected argument of type template.UploadImageRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_UploadImageRequest(buffer_arg) {
  return grpc$proto_avatar_pb.UploadImageRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_UploadImageResponse(arg) {
  if (!(arg instanceof grpc$proto_avatar_pb.UploadImageResponse)) {
    throw new Error('Expected argument of type template.UploadImageResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_UploadImageResponse(buffer_arg) {
  return grpc$proto_avatar_pb.UploadImageResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_UploadUrlRequest(arg) {
  if (!(arg instanceof grpc$proto_avatar_pb.UploadUrlRequest)) {
    throw new Error('Expected argument of type template.UploadUrlRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_UploadUrlRequest(buffer_arg) {
  return grpc$proto_avatar_pb.UploadUrlRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_UploadUrlResponse(arg) {
  if (!(arg instanceof grpc$proto_avatar_pb.UploadUrlResponse)) {
    throw new Error('Expected argument of type template.UploadUrlResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_UploadUrlResponse(buffer_arg) {
  return grpc$proto_avatar_pb.UploadUrlResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var AvatarServiceService = exports.AvatarServiceService = {
  requestAUploadURL: {
    path: '/template.AvatarService/RequestAUploadURL',
    requestStream: false,
    responseStream: false,
    requestType: grpc$proto_avatar_pb.UploadUrlRequest,
    responseType: grpc$proto_avatar_pb.UploadUrlResponse,
    requestSerialize: serialize_template_UploadUrlRequest,
    requestDeserialize: deserialize_template_UploadUrlRequest,
    responseSerialize: serialize_template_UploadUrlResponse,
    responseDeserialize: deserialize_template_UploadUrlResponse,
  },
  uploadImage: {
    path: '/template.AvatarService/UploadImage',
    requestStream: true,
    responseStream: false,
    requestType: grpc$proto_avatar_pb.UploadImageRequest,
    responseType: grpc$proto_avatar_pb.UploadImageResponse,
    requestSerialize: serialize_template_UploadImageRequest,
    requestDeserialize: deserialize_template_UploadImageRequest,
    responseSerialize: serialize_template_UploadImageResponse,
    responseDeserialize: deserialize_template_UploadImageResponse,
  },
  confirmUpload: {
    path: '/template.AvatarService/ConfirmUpload',
    requestStream: false,
    responseStream: false,
    requestType: grpc$proto_avatar_pb.ConfirmUploadRequest,
    responseType: grpc$proto_avatar_pb.ConfirmUploadResponse,
    requestSerialize: serialize_template_ConfirmUploadRequest,
    requestDeserialize: deserialize_template_ConfirmUploadRequest,
    responseSerialize: serialize_template_ConfirmUploadResponse,
    responseDeserialize: deserialize_template_ConfirmUploadResponse,
  },
  // confirm upload and save to db
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
