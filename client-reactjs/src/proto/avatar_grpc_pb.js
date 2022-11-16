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

function serialize_template_UploadRequest(arg) {
  if (!(arg instanceof avatar_pb.UploadRequest)) {
    throw new Error('Expected argument of type template.UploadRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_UploadRequest(buffer_arg) {
  return avatar_pb.UploadRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_UploadResponse(arg) {
  if (!(arg instanceof avatar_pb.UploadResponse)) {
    throw new Error('Expected argument of type template.UploadResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_UploadResponse(buffer_arg) {
  return avatar_pb.UploadResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var AvatarServiceService = exports.AvatarServiceService = {
  upload: {
    path: '/template.AvatarService/Upload',
    requestStream: true,
    responseStream: false,
    requestType: avatar_pb.UploadRequest,
    responseType: avatar_pb.UploadResponse,
    requestSerialize: serialize_template_UploadRequest,
    requestDeserialize: deserialize_template_UploadRequest,
    responseSerialize: serialize_template_UploadResponse,
    responseDeserialize: deserialize_template_UploadResponse,
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
};

exports.AvatarServiceClient = grpc.makeGenericClientConstructor(AvatarServiceService);
