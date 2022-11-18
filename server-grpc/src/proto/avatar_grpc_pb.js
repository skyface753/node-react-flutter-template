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
    requestType: google_protobuf_empty_pb.Empty,
    responseType: avatar_pb.UploadUrlResponse,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
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
};

exports.AvatarServiceClient = grpc.makeGenericClientConstructor(AvatarServiceService);
