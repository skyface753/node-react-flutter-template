// package: template
// file: grpc-proto/auth.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as grpc_proto_auth_pb from "../grpc-proto/auth_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as grpc_proto_google_api_annotations_pb from "../grpc-proto/google/api/annotations_pb";

interface IAuthServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    login: IAuthServiceService_ILogin;
    refreshToken: IAuthServiceService_IRefreshToken;
    logout: IAuthServiceService_ILogout;
    register: IAuthServiceService_IRegister;
    status: IAuthServiceService_IStatus;
    disableTOTP: IAuthServiceService_IDisableTOTP;
    enableTOTP: IAuthServiceService_IEnableTOTP;
    verifyTOTP: IAuthServiceService_IVerifyTOTP;
}

interface IAuthServiceService_ILogin extends grpc.MethodDefinition<grpc_proto_auth_pb.LoginRequest, grpc_proto_auth_pb.DefaultAuthResponse> {
    path: "/template.AuthService/Login";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<grpc_proto_auth_pb.LoginRequest>;
    requestDeserialize: grpc.deserialize<grpc_proto_auth_pb.LoginRequest>;
    responseSerialize: grpc.serialize<grpc_proto_auth_pb.DefaultAuthResponse>;
    responseDeserialize: grpc.deserialize<grpc_proto_auth_pb.DefaultAuthResponse>;
}
interface IAuthServiceService_IRefreshToken extends grpc.MethodDefinition<grpc_proto_auth_pb.RefreshTokenRequest, grpc_proto_auth_pb.DefaultAuthResponse> {
    path: "/template.AuthService/RefreshToken";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<grpc_proto_auth_pb.RefreshTokenRequest>;
    requestDeserialize: grpc.deserialize<grpc_proto_auth_pb.RefreshTokenRequest>;
    responseSerialize: grpc.serialize<grpc_proto_auth_pb.DefaultAuthResponse>;
    responseDeserialize: grpc.deserialize<grpc_proto_auth_pb.DefaultAuthResponse>;
}
interface IAuthServiceService_ILogout extends grpc.MethodDefinition<grpc_proto_auth_pb.LogoutRequest, grpc_proto_auth_pb.LogoutResponse> {
    path: "/template.AuthService/Logout";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<grpc_proto_auth_pb.LogoutRequest>;
    requestDeserialize: grpc.deserialize<grpc_proto_auth_pb.LogoutRequest>;
    responseSerialize: grpc.serialize<grpc_proto_auth_pb.LogoutResponse>;
    responseDeserialize: grpc.deserialize<grpc_proto_auth_pb.LogoutResponse>;
}
interface IAuthServiceService_IRegister extends grpc.MethodDefinition<grpc_proto_auth_pb.RegisterRequest, grpc_proto_auth_pb.DefaultAuthResponse> {
    path: "/template.AuthService/Register";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<grpc_proto_auth_pb.RegisterRequest>;
    requestDeserialize: grpc.deserialize<grpc_proto_auth_pb.RegisterRequest>;
    responseSerialize: grpc.serialize<grpc_proto_auth_pb.DefaultAuthResponse>;
    responseDeserialize: grpc.deserialize<grpc_proto_auth_pb.DefaultAuthResponse>;
}
interface IAuthServiceService_IStatus extends grpc.MethodDefinition<grpc_proto_auth_pb.StatusRequest, grpc_proto_auth_pb.StatusResponse> {
    path: "/template.AuthService/Status";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<grpc_proto_auth_pb.StatusRequest>;
    requestDeserialize: grpc.deserialize<grpc_proto_auth_pb.StatusRequest>;
    responseSerialize: grpc.serialize<grpc_proto_auth_pb.StatusResponse>;
    responseDeserialize: grpc.deserialize<grpc_proto_auth_pb.StatusResponse>;
}
interface IAuthServiceService_IDisableTOTP extends grpc.MethodDefinition<grpc_proto_auth_pb.DisableTOTPRequest, grpc_proto_auth_pb.DisableTOTPResponse> {
    path: "/template.AuthService/DisableTOTP";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<grpc_proto_auth_pb.DisableTOTPRequest>;
    requestDeserialize: grpc.deserialize<grpc_proto_auth_pb.DisableTOTPRequest>;
    responseSerialize: grpc.serialize<grpc_proto_auth_pb.DisableTOTPResponse>;
    responseDeserialize: grpc.deserialize<grpc_proto_auth_pb.DisableTOTPResponse>;
}
interface IAuthServiceService_IEnableTOTP extends grpc.MethodDefinition<grpc_proto_auth_pb.EnableTOTPRequest, grpc_proto_auth_pb.EnableTOTPResponse> {
    path: "/template.AuthService/EnableTOTP";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<grpc_proto_auth_pb.EnableTOTPRequest>;
    requestDeserialize: grpc.deserialize<grpc_proto_auth_pb.EnableTOTPRequest>;
    responseSerialize: grpc.serialize<grpc_proto_auth_pb.EnableTOTPResponse>;
    responseDeserialize: grpc.deserialize<grpc_proto_auth_pb.EnableTOTPResponse>;
}
interface IAuthServiceService_IVerifyTOTP extends grpc.MethodDefinition<grpc_proto_auth_pb.VerifyTOTPRequest, grpc_proto_auth_pb.VerifyTOTPResponse> {
    path: "/template.AuthService/VerifyTOTP";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<grpc_proto_auth_pb.VerifyTOTPRequest>;
    requestDeserialize: grpc.deserialize<grpc_proto_auth_pb.VerifyTOTPRequest>;
    responseSerialize: grpc.serialize<grpc_proto_auth_pb.VerifyTOTPResponse>;
    responseDeserialize: grpc.deserialize<grpc_proto_auth_pb.VerifyTOTPResponse>;
}

export const AuthServiceService: IAuthServiceService;

export interface IAuthServiceServer extends grpc.UntypedServiceImplementation {
    login: grpc.handleUnaryCall<grpc_proto_auth_pb.LoginRequest, grpc_proto_auth_pb.DefaultAuthResponse>;
    refreshToken: grpc.handleUnaryCall<grpc_proto_auth_pb.RefreshTokenRequest, grpc_proto_auth_pb.DefaultAuthResponse>;
    logout: grpc.handleUnaryCall<grpc_proto_auth_pb.LogoutRequest, grpc_proto_auth_pb.LogoutResponse>;
    register: grpc.handleUnaryCall<grpc_proto_auth_pb.RegisterRequest, grpc_proto_auth_pb.DefaultAuthResponse>;
    status: grpc.handleUnaryCall<grpc_proto_auth_pb.StatusRequest, grpc_proto_auth_pb.StatusResponse>;
    disableTOTP: grpc.handleUnaryCall<grpc_proto_auth_pb.DisableTOTPRequest, grpc_proto_auth_pb.DisableTOTPResponse>;
    enableTOTP: grpc.handleUnaryCall<grpc_proto_auth_pb.EnableTOTPRequest, grpc_proto_auth_pb.EnableTOTPResponse>;
    verifyTOTP: grpc.handleUnaryCall<grpc_proto_auth_pb.VerifyTOTPRequest, grpc_proto_auth_pb.VerifyTOTPResponse>;
}

export interface IAuthServiceClient {
    login(request: grpc_proto_auth_pb.LoginRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    login(request: grpc_proto_auth_pb.LoginRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    login(request: grpc_proto_auth_pb.LoginRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    refreshToken(request: grpc_proto_auth_pb.RefreshTokenRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    refreshToken(request: grpc_proto_auth_pb.RefreshTokenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    refreshToken(request: grpc_proto_auth_pb.RefreshTokenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    logout(request: grpc_proto_auth_pb.LogoutRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    logout(request: grpc_proto_auth_pb.LogoutRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    logout(request: grpc_proto_auth_pb.LogoutRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    register(request: grpc_proto_auth_pb.RegisterRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    register(request: grpc_proto_auth_pb.RegisterRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    register(request: grpc_proto_auth_pb.RegisterRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    status(request: grpc_proto_auth_pb.StatusRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    status(request: grpc_proto_auth_pb.StatusRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    status(request: grpc_proto_auth_pb.StatusRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    disableTOTP(request: grpc_proto_auth_pb.DisableTOTPRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DisableTOTPResponse) => void): grpc.ClientUnaryCall;
    disableTOTP(request: grpc_proto_auth_pb.DisableTOTPRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DisableTOTPResponse) => void): grpc.ClientUnaryCall;
    disableTOTP(request: grpc_proto_auth_pb.DisableTOTPRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DisableTOTPResponse) => void): grpc.ClientUnaryCall;
    enableTOTP(request: grpc_proto_auth_pb.EnableTOTPRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.EnableTOTPResponse) => void): grpc.ClientUnaryCall;
    enableTOTP(request: grpc_proto_auth_pb.EnableTOTPRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.EnableTOTPResponse) => void): grpc.ClientUnaryCall;
    enableTOTP(request: grpc_proto_auth_pb.EnableTOTPRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.EnableTOTPResponse) => void): grpc.ClientUnaryCall;
    verifyTOTP(request: grpc_proto_auth_pb.VerifyTOTPRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.VerifyTOTPResponse) => void): grpc.ClientUnaryCall;
    verifyTOTP(request: grpc_proto_auth_pb.VerifyTOTPRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.VerifyTOTPResponse) => void): grpc.ClientUnaryCall;
    verifyTOTP(request: grpc_proto_auth_pb.VerifyTOTPRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.VerifyTOTPResponse) => void): grpc.ClientUnaryCall;
}

export class AuthServiceClient extends grpc.Client implements IAuthServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public login(request: grpc_proto_auth_pb.LoginRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    public login(request: grpc_proto_auth_pb.LoginRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    public login(request: grpc_proto_auth_pb.LoginRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    public refreshToken(request: grpc_proto_auth_pb.RefreshTokenRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    public refreshToken(request: grpc_proto_auth_pb.RefreshTokenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    public refreshToken(request: grpc_proto_auth_pb.RefreshTokenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    public logout(request: grpc_proto_auth_pb.LogoutRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    public logout(request: grpc_proto_auth_pb.LogoutRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    public logout(request: grpc_proto_auth_pb.LogoutRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    public register(request: grpc_proto_auth_pb.RegisterRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    public register(request: grpc_proto_auth_pb.RegisterRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    public register(request: grpc_proto_auth_pb.RegisterRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DefaultAuthResponse) => void): grpc.ClientUnaryCall;
    public status(request: grpc_proto_auth_pb.StatusRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    public status(request: grpc_proto_auth_pb.StatusRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    public status(request: grpc_proto_auth_pb.StatusRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    public disableTOTP(request: grpc_proto_auth_pb.DisableTOTPRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DisableTOTPResponse) => void): grpc.ClientUnaryCall;
    public disableTOTP(request: grpc_proto_auth_pb.DisableTOTPRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DisableTOTPResponse) => void): grpc.ClientUnaryCall;
    public disableTOTP(request: grpc_proto_auth_pb.DisableTOTPRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.DisableTOTPResponse) => void): grpc.ClientUnaryCall;
    public enableTOTP(request: grpc_proto_auth_pb.EnableTOTPRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.EnableTOTPResponse) => void): grpc.ClientUnaryCall;
    public enableTOTP(request: grpc_proto_auth_pb.EnableTOTPRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.EnableTOTPResponse) => void): grpc.ClientUnaryCall;
    public enableTOTP(request: grpc_proto_auth_pb.EnableTOTPRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.EnableTOTPResponse) => void): grpc.ClientUnaryCall;
    public verifyTOTP(request: grpc_proto_auth_pb.VerifyTOTPRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.VerifyTOTPResponse) => void): grpc.ClientUnaryCall;
    public verifyTOTP(request: grpc_proto_auth_pb.VerifyTOTPRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.VerifyTOTPResponse) => void): grpc.ClientUnaryCall;
    public verifyTOTP(request: grpc_proto_auth_pb.VerifyTOTPRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_auth_pb.VerifyTOTPResponse) => void): grpc.ClientUnaryCall;
}
