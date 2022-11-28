// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var avatar_pb = require('./avatar_pb.js');
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
  if (!(arg instanceof avatar_pb.GetAvatarViewRequest)) {
    throw new Error('Expected argument of type template.GetAvatarViewRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_GetAvatarViewRequest(buffer_arg) {
  return avatar_pb.GetAvatarViewRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_GetAvatarViewResponse(arg) {
  if (!(arg instanceof avatar_pb.GetAvatarViewResponse)) {
    throw new Error('Expected argument of type template.GetAvatarViewResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_GetAvatarViewResponse(buffer_arg) {
  return avatar_pb.GetAvatarViewResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_UploadUrlRequest(arg) {
  if (!(arg instanceof avatar_pb.UploadUrlRequest)) {
    throw new Error('Expected argument of type template.UploadUrlRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_UploadUrlRequest(buffer_arg) {
  return avatar_pb.UploadUrlRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_UploadUrlResponse(arg) {
  if (!(arg instanceof avatar_pb.UploadUrlResponse)) {
    throw new Error('Expected argument of type template.UploadUrlResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_UploadUrlResponse(buffer_arg) {
  return avatar_pb.UploadUrlResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var AvatarServiceService = exports.AvatarServiceService = {
  requestAUploadURL: {
    path: '/template.AvatarService/RequestAUploadURL',
    requestStream: false,
    responseStream: false,
    requestType: avatar_pb.UploadUrlRequest,
    responseType: avatar_pb.UploadUrlResponse,
    requestSerialize: serialize_template_UploadUrlRequest,
    requestDeserialize: deserialize_template_UploadUrlRequest,
    responseSerialize: serialize_template_UploadUrlResponse,
    responseDeserialize: deserialize_template_UploadUrlResponse,
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
    requestType: avatar_pb.GetAvatarViewRequest,
    responseType: avatar_pb.GetAvatarViewResponse,
    requestSerialize: serialize_template_GetAvatarViewRequest,
    requestDeserialize: deserialize_template_GetAvatarViewRequest,
    responseSerialize: serialize_template_GetAvatarViewResponse,
    responseDeserialize: deserialize_template_GetAvatarViewResponse,
  },
};

exports.AvatarServiceClient = grpc.makeGenericClientConstructor(AvatarServiceService);
