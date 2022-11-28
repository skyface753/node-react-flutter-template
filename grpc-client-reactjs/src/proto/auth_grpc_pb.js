// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var auth_pb = require('./auth_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_template_DefaultAuthResponse(arg) {
  if (!(arg instanceof auth_pb.DefaultAuthResponse)) {
    throw new Error('Expected argument of type template.DefaultAuthResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_DefaultAuthResponse(buffer_arg) {
  return auth_pb.DefaultAuthResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_DisableTOTPRequest(arg) {
  if (!(arg instanceof auth_pb.DisableTOTPRequest)) {
    throw new Error('Expected argument of type template.DisableTOTPRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_DisableTOTPRequest(buffer_arg) {
  return auth_pb.DisableTOTPRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_DisableTOTPResponse(arg) {
  if (!(arg instanceof auth_pb.DisableTOTPResponse)) {
    throw new Error('Expected argument of type template.DisableTOTPResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_DisableTOTPResponse(buffer_arg) {
  return auth_pb.DisableTOTPResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_EnableTOTPRequest(arg) {
  if (!(arg instanceof auth_pb.EnableTOTPRequest)) {
    throw new Error('Expected argument of type template.EnableTOTPRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_EnableTOTPRequest(buffer_arg) {
  return auth_pb.EnableTOTPRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_EnableTOTPResponse(arg) {
  if (!(arg instanceof auth_pb.EnableTOTPResponse)) {
    throw new Error('Expected argument of type template.EnableTOTPResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_EnableTOTPResponse(buffer_arg) {
  return auth_pb.EnableTOTPResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_LoginRequest(arg) {
  if (!(arg instanceof auth_pb.LoginRequest)) {
    throw new Error('Expected argument of type template.LoginRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_LoginRequest(buffer_arg) {
  return auth_pb.LoginRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_LogoutRequest(arg) {
  if (!(arg instanceof auth_pb.LogoutRequest)) {
    throw new Error('Expected argument of type template.LogoutRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_LogoutRequest(buffer_arg) {
  return auth_pb.LogoutRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_LogoutResponse(arg) {
  if (!(arg instanceof auth_pb.LogoutResponse)) {
    throw new Error('Expected argument of type template.LogoutResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_LogoutResponse(buffer_arg) {
  return auth_pb.LogoutResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_RefreshTokenRequest(arg) {
  if (!(arg instanceof auth_pb.RefreshTokenRequest)) {
    throw new Error('Expected argument of type template.RefreshTokenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_RefreshTokenRequest(buffer_arg) {
  return auth_pb.RefreshTokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_RegisterRequest(arg) {
  if (!(arg instanceof auth_pb.RegisterRequest)) {
    throw new Error('Expected argument of type template.RegisterRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_RegisterRequest(buffer_arg) {
  return auth_pb.RegisterRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_StatusRequest(arg) {
  if (!(arg instanceof auth_pb.StatusRequest)) {
    throw new Error('Expected argument of type template.StatusRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_StatusRequest(buffer_arg) {
  return auth_pb.StatusRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_StatusResponse(arg) {
  if (!(arg instanceof auth_pb.StatusResponse)) {
    throw new Error('Expected argument of type template.StatusResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_StatusResponse(buffer_arg) {
  return auth_pb.StatusResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_VerifyTOTPRequest(arg) {
  if (!(arg instanceof auth_pb.VerifyTOTPRequest)) {
    throw new Error('Expected argument of type template.VerifyTOTPRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_VerifyTOTPRequest(buffer_arg) {
  return auth_pb.VerifyTOTPRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_template_VerifyTOTPResponse(arg) {
  if (!(arg instanceof auth_pb.VerifyTOTPResponse)) {
    throw new Error('Expected argument of type template.VerifyTOTPResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_template_VerifyTOTPResponse(buffer_arg) {
  return auth_pb.VerifyTOTPResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var AuthServiceService = exports.AuthServiceService = {
  login: {
    path: '/template.AuthService/Login',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.LoginRequest,
    responseType: auth_pb.DefaultAuthResponse,
    requestSerialize: serialize_template_LoginRequest,
    requestDeserialize: deserialize_template_LoginRequest,
    responseSerialize: serialize_template_DefaultAuthResponse,
    responseDeserialize: deserialize_template_DefaultAuthResponse,
  },
  refreshToken: {
    path: '/template.AuthService/RefreshToken',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.RefreshTokenRequest,
    responseType: auth_pb.DefaultAuthResponse,
    requestSerialize: serialize_template_RefreshTokenRequest,
    requestDeserialize: deserialize_template_RefreshTokenRequest,
    responseSerialize: serialize_template_DefaultAuthResponse,
    responseDeserialize: deserialize_template_DefaultAuthResponse,
  },
  logout: {
    path: '/template.AuthService/Logout',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.LogoutRequest,
    responseType: auth_pb.LogoutResponse,
    requestSerialize: serialize_template_LogoutRequest,
    requestDeserialize: deserialize_template_LogoutRequest,
    responseSerialize: serialize_template_LogoutResponse,
    responseDeserialize: deserialize_template_LogoutResponse,
  },
  register: {
    path: '/template.AuthService/Register',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.RegisterRequest,
    responseType: auth_pb.DefaultAuthResponse,
    requestSerialize: serialize_template_RegisterRequest,
    requestDeserialize: deserialize_template_RegisterRequest,
    responseSerialize: serialize_template_DefaultAuthResponse,
    responseDeserialize: deserialize_template_DefaultAuthResponse,
  },
  status: {
    path: '/template.AuthService/Status',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.StatusRequest,
    responseType: auth_pb.StatusResponse,
    requestSerialize: serialize_template_StatusRequest,
    requestDeserialize: deserialize_template_StatusRequest,
    responseSerialize: serialize_template_StatusResponse,
    responseDeserialize: deserialize_template_StatusResponse,
  },
  disableTOTP: {
    path: '/template.AuthService/DisableTOTP',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.DisableTOTPRequest,
    responseType: auth_pb.DisableTOTPResponse,
    requestSerialize: serialize_template_DisableTOTPRequest,
    requestDeserialize: deserialize_template_DisableTOTPRequest,
    responseSerialize: serialize_template_DisableTOTPResponse,
    responseDeserialize: deserialize_template_DisableTOTPResponse,
  },
  enableTOTP: {
    path: '/template.AuthService/EnableTOTP',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.EnableTOTPRequest,
    responseType: auth_pb.EnableTOTPResponse,
    requestSerialize: serialize_template_EnableTOTPRequest,
    requestDeserialize: deserialize_template_EnableTOTPRequest,
    responseSerialize: serialize_template_EnableTOTPResponse,
    responseDeserialize: deserialize_template_EnableTOTPResponse,
  },
  verifyTOTP: {
    path: '/template.AuthService/VerifyTOTP',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.VerifyTOTPRequest,
    responseType: auth_pb.VerifyTOTPResponse,
    requestSerialize: serialize_template_VerifyTOTPRequest,
    requestDeserialize: deserialize_template_VerifyTOTPRequest,
    responseSerialize: serialize_template_VerifyTOTPResponse,
    responseDeserialize: deserialize_template_VerifyTOTPResponse,
  },
};

exports.AuthServiceClient = grpc.makeGenericClientConstructor(AuthServiceService);
