// package: template
// file: grpc-proto/avatar.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as grpc_proto_avatar_pb from "../grpc-proto/avatar_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IAvatarServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    requestAUploadURL: IAvatarServiceService_IRequestAUploadURL;
    uploadImage: IAvatarServiceService_IUploadImage;
    confirmUpload: IAvatarServiceService_IConfirmUpload;
    delete: IAvatarServiceService_IDelete;
    getAvatarView: IAvatarServiceService_IGetAvatarView;
}

interface IAvatarServiceService_IRequestAUploadURL extends grpc.MethodDefinition<grpc_proto_avatar_pb.UploadUrlRequest, grpc_proto_avatar_pb.UploadUrlResponse> {
    path: "/template.AvatarService/RequestAUploadURL";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<grpc_proto_avatar_pb.UploadUrlRequest>;
    requestDeserialize: grpc.deserialize<grpc_proto_avatar_pb.UploadUrlRequest>;
    responseSerialize: grpc.serialize<grpc_proto_avatar_pb.UploadUrlResponse>;
    responseDeserialize: grpc.deserialize<grpc_proto_avatar_pb.UploadUrlResponse>;
}
interface IAvatarServiceService_IUploadImage extends grpc.MethodDefinition<grpc_proto_avatar_pb.UploadImageRequest, grpc_proto_avatar_pb.UploadImageResponse> {
    path: "/template.AvatarService/UploadImage";
    requestStream: true;
    responseStream: false;
    requestSerialize: grpc.serialize<grpc_proto_avatar_pb.UploadImageRequest>;
    requestDeserialize: grpc.deserialize<grpc_proto_avatar_pb.UploadImageRequest>;
    responseSerialize: grpc.serialize<grpc_proto_avatar_pb.UploadImageResponse>;
    responseDeserialize: grpc.deserialize<grpc_proto_avatar_pb.UploadImageResponse>;
}
interface IAvatarServiceService_IConfirmUpload extends grpc.MethodDefinition<grpc_proto_avatar_pb.ConfirmUploadRequest, grpc_proto_avatar_pb.ConfirmUploadResponse> {
    path: "/template.AvatarService/ConfirmUpload";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<grpc_proto_avatar_pb.ConfirmUploadRequest>;
    requestDeserialize: grpc.deserialize<grpc_proto_avatar_pb.ConfirmUploadRequest>;
    responseSerialize: grpc.serialize<grpc_proto_avatar_pb.ConfirmUploadResponse>;
    responseDeserialize: grpc.deserialize<grpc_proto_avatar_pb.ConfirmUploadResponse>;
}
interface IAvatarServiceService_IDelete extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, google_protobuf_empty_pb.Empty> {
    path: "/template.AvatarService/Delete";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IAvatarServiceService_IGetAvatarView extends grpc.MethodDefinition<grpc_proto_avatar_pb.GetAvatarViewRequest, grpc_proto_avatar_pb.GetAvatarViewResponse> {
    path: "/template.AvatarService/GetAvatarView";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<grpc_proto_avatar_pb.GetAvatarViewRequest>;
    requestDeserialize: grpc.deserialize<grpc_proto_avatar_pb.GetAvatarViewRequest>;
    responseSerialize: grpc.serialize<grpc_proto_avatar_pb.GetAvatarViewResponse>;
    responseDeserialize: grpc.deserialize<grpc_proto_avatar_pb.GetAvatarViewResponse>;
}

export const AvatarServiceService: IAvatarServiceService;

export interface IAvatarServiceServer extends grpc.UntypedServiceImplementation {
    requestAUploadURL: grpc.handleUnaryCall<grpc_proto_avatar_pb.UploadUrlRequest, grpc_proto_avatar_pb.UploadUrlResponse>;
    uploadImage: grpc.handleClientStreamingCall<grpc_proto_avatar_pb.UploadImageRequest, grpc_proto_avatar_pb.UploadImageResponse>;
    confirmUpload: grpc.handleUnaryCall<grpc_proto_avatar_pb.ConfirmUploadRequest, grpc_proto_avatar_pb.ConfirmUploadResponse>;
    delete: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, google_protobuf_empty_pb.Empty>;
    getAvatarView: grpc.handleUnaryCall<grpc_proto_avatar_pb.GetAvatarViewRequest, grpc_proto_avatar_pb.GetAvatarViewResponse>;
}

export interface IAvatarServiceClient {
    requestAUploadURL(request: grpc_proto_avatar_pb.UploadUrlRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadUrlResponse) => void): grpc.ClientUnaryCall;
    requestAUploadURL(request: grpc_proto_avatar_pb.UploadUrlRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadUrlResponse) => void): grpc.ClientUnaryCall;
    requestAUploadURL(request: grpc_proto_avatar_pb.UploadUrlRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadUrlResponse) => void): grpc.ClientUnaryCall;
    uploadImage(callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadImageResponse) => void): grpc.ClientWritableStream<grpc_proto_avatar_pb.UploadImageRequest>;
    uploadImage(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadImageResponse) => void): grpc.ClientWritableStream<grpc_proto_avatar_pb.UploadImageRequest>;
    uploadImage(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadImageResponse) => void): grpc.ClientWritableStream<grpc_proto_avatar_pb.UploadImageRequest>;
    uploadImage(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadImageResponse) => void): grpc.ClientWritableStream<grpc_proto_avatar_pb.UploadImageRequest>;
    confirmUpload(request: grpc_proto_avatar_pb.ConfirmUploadRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.ConfirmUploadResponse) => void): grpc.ClientUnaryCall;
    confirmUpload(request: grpc_proto_avatar_pb.ConfirmUploadRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.ConfirmUploadResponse) => void): grpc.ClientUnaryCall;
    confirmUpload(request: grpc_proto_avatar_pb.ConfirmUploadRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.ConfirmUploadResponse) => void): grpc.ClientUnaryCall;
    delete(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    delete(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    delete(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    getAvatarView(request: grpc_proto_avatar_pb.GetAvatarViewRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.GetAvatarViewResponse) => void): grpc.ClientUnaryCall;
    getAvatarView(request: grpc_proto_avatar_pb.GetAvatarViewRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.GetAvatarViewResponse) => void): grpc.ClientUnaryCall;
    getAvatarView(request: grpc_proto_avatar_pb.GetAvatarViewRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.GetAvatarViewResponse) => void): grpc.ClientUnaryCall;
}

export class AvatarServiceClient extends grpc.Client implements IAvatarServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public requestAUploadURL(request: grpc_proto_avatar_pb.UploadUrlRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadUrlResponse) => void): grpc.ClientUnaryCall;
    public requestAUploadURL(request: grpc_proto_avatar_pb.UploadUrlRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadUrlResponse) => void): grpc.ClientUnaryCall;
    public requestAUploadURL(request: grpc_proto_avatar_pb.UploadUrlRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadUrlResponse) => void): grpc.ClientUnaryCall;
    public uploadImage(callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadImageResponse) => void): grpc.ClientWritableStream<grpc_proto_avatar_pb.UploadImageRequest>;
    public uploadImage(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadImageResponse) => void): grpc.ClientWritableStream<grpc_proto_avatar_pb.UploadImageRequest>;
    public uploadImage(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadImageResponse) => void): grpc.ClientWritableStream<grpc_proto_avatar_pb.UploadImageRequest>;
    public uploadImage(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadImageResponse) => void): grpc.ClientWritableStream<grpc_proto_avatar_pb.UploadImageRequest>;
    public confirmUpload(request: grpc_proto_avatar_pb.ConfirmUploadRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.ConfirmUploadResponse) => void): grpc.ClientUnaryCall;
    public confirmUpload(request: grpc_proto_avatar_pb.ConfirmUploadRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.ConfirmUploadResponse) => void): grpc.ClientUnaryCall;
    public confirmUpload(request: grpc_proto_avatar_pb.ConfirmUploadRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.ConfirmUploadResponse) => void): grpc.ClientUnaryCall;
    public delete(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public delete(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public delete(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public getAvatarView(request: grpc_proto_avatar_pb.GetAvatarViewRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.GetAvatarViewResponse) => void): grpc.ClientUnaryCall;
    public getAvatarView(request: grpc_proto_avatar_pb.GetAvatarViewRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.GetAvatarViewResponse) => void): grpc.ClientUnaryCall;
    public getAvatarView(request: grpc_proto_avatar_pb.GetAvatarViewRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.GetAvatarViewResponse) => void): grpc.ClientUnaryCall;
}
