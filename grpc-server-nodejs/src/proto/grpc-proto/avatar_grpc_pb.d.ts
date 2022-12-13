// package: template
// file: grpc-proto/avatar.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as grpc_proto_avatar_pb from "../grpc-proto/avatar_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IAvatarServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getUploadURL: IAvatarServiceService_IGetUploadURL;
    confirmUpload: IAvatarServiceService_IConfirmUpload;
    tESTUploadImage: IAvatarServiceService_ITESTUploadImage;
    delete: IAvatarServiceService_IDelete;
    getAvatarView: IAvatarServiceService_IGetAvatarView;
}

interface IAvatarServiceService_IGetUploadURL extends grpc.MethodDefinition<grpc_proto_avatar_pb.UploadGetUrlRequest, grpc_proto_avatar_pb.UploadGetUrlResponse> {
    path: "/template.AvatarService/GetUploadURL";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<grpc_proto_avatar_pb.UploadGetUrlRequest>;
    requestDeserialize: grpc.deserialize<grpc_proto_avatar_pb.UploadGetUrlRequest>;
    responseSerialize: grpc.serialize<grpc_proto_avatar_pb.UploadGetUrlResponse>;
    responseDeserialize: grpc.deserialize<grpc_proto_avatar_pb.UploadGetUrlResponse>;
}
interface IAvatarServiceService_IConfirmUpload extends grpc.MethodDefinition<grpc_proto_avatar_pb.UploadConfirmRequest, grpc_proto_avatar_pb.UploadConfirmResponse> {
    path: "/template.AvatarService/ConfirmUpload";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<grpc_proto_avatar_pb.UploadConfirmRequest>;
    requestDeserialize: grpc.deserialize<grpc_proto_avatar_pb.UploadConfirmRequest>;
    responseSerialize: grpc.serialize<grpc_proto_avatar_pb.UploadConfirmResponse>;
    responseDeserialize: grpc.deserialize<grpc_proto_avatar_pb.UploadConfirmResponse>;
}
interface IAvatarServiceService_ITESTUploadImage extends grpc.MethodDefinition<grpc_proto_avatar_pb.TESTUploadImageRequest, grpc_proto_avatar_pb.TESTUploadImageResponse> {
    path: "/template.AvatarService/TESTUploadImage";
    requestStream: true;
    responseStream: false;
    requestSerialize: grpc.serialize<grpc_proto_avatar_pb.TESTUploadImageRequest>;
    requestDeserialize: grpc.deserialize<grpc_proto_avatar_pb.TESTUploadImageRequest>;
    responseSerialize: grpc.serialize<grpc_proto_avatar_pb.TESTUploadImageResponse>;
    responseDeserialize: grpc.deserialize<grpc_proto_avatar_pb.TESTUploadImageResponse>;
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
    getUploadURL: grpc.handleUnaryCall<grpc_proto_avatar_pb.UploadGetUrlRequest, grpc_proto_avatar_pb.UploadGetUrlResponse>;
    confirmUpload: grpc.handleUnaryCall<grpc_proto_avatar_pb.UploadConfirmRequest, grpc_proto_avatar_pb.UploadConfirmResponse>;
    tESTUploadImage: grpc.handleClientStreamingCall<grpc_proto_avatar_pb.TESTUploadImageRequest, grpc_proto_avatar_pb.TESTUploadImageResponse>;
    delete: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, google_protobuf_empty_pb.Empty>;
    getAvatarView: grpc.handleUnaryCall<grpc_proto_avatar_pb.GetAvatarViewRequest, grpc_proto_avatar_pb.GetAvatarViewResponse>;
}

export interface IAvatarServiceClient {
    getUploadURL(request: grpc_proto_avatar_pb.UploadGetUrlRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadGetUrlResponse) => void): grpc.ClientUnaryCall;
    getUploadURL(request: grpc_proto_avatar_pb.UploadGetUrlRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadGetUrlResponse) => void): grpc.ClientUnaryCall;
    getUploadURL(request: grpc_proto_avatar_pb.UploadGetUrlRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadGetUrlResponse) => void): grpc.ClientUnaryCall;
    confirmUpload(request: grpc_proto_avatar_pb.UploadConfirmRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadConfirmResponse) => void): grpc.ClientUnaryCall;
    confirmUpload(request: grpc_proto_avatar_pb.UploadConfirmRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadConfirmResponse) => void): grpc.ClientUnaryCall;
    confirmUpload(request: grpc_proto_avatar_pb.UploadConfirmRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadConfirmResponse) => void): grpc.ClientUnaryCall;
    tESTUploadImage(callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.TESTUploadImageResponse) => void): grpc.ClientWritableStream<grpc_proto_avatar_pb.TESTUploadImageRequest>;
    tESTUploadImage(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.TESTUploadImageResponse) => void): grpc.ClientWritableStream<grpc_proto_avatar_pb.TESTUploadImageRequest>;
    tESTUploadImage(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.TESTUploadImageResponse) => void): grpc.ClientWritableStream<grpc_proto_avatar_pb.TESTUploadImageRequest>;
    tESTUploadImage(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.TESTUploadImageResponse) => void): grpc.ClientWritableStream<grpc_proto_avatar_pb.TESTUploadImageRequest>;
    delete(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    delete(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    delete(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    getAvatarView(request: grpc_proto_avatar_pb.GetAvatarViewRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.GetAvatarViewResponse) => void): grpc.ClientUnaryCall;
    getAvatarView(request: grpc_proto_avatar_pb.GetAvatarViewRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.GetAvatarViewResponse) => void): grpc.ClientUnaryCall;
    getAvatarView(request: grpc_proto_avatar_pb.GetAvatarViewRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.GetAvatarViewResponse) => void): grpc.ClientUnaryCall;
}

export class AvatarServiceClient extends grpc.Client implements IAvatarServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public getUploadURL(request: grpc_proto_avatar_pb.UploadGetUrlRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadGetUrlResponse) => void): grpc.ClientUnaryCall;
    public getUploadURL(request: grpc_proto_avatar_pb.UploadGetUrlRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadGetUrlResponse) => void): grpc.ClientUnaryCall;
    public getUploadURL(request: grpc_proto_avatar_pb.UploadGetUrlRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadGetUrlResponse) => void): grpc.ClientUnaryCall;
    public confirmUpload(request: grpc_proto_avatar_pb.UploadConfirmRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadConfirmResponse) => void): grpc.ClientUnaryCall;
    public confirmUpload(request: grpc_proto_avatar_pb.UploadConfirmRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadConfirmResponse) => void): grpc.ClientUnaryCall;
    public confirmUpload(request: grpc_proto_avatar_pb.UploadConfirmRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.UploadConfirmResponse) => void): grpc.ClientUnaryCall;
    public tESTUploadImage(callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.TESTUploadImageResponse) => void): grpc.ClientWritableStream<grpc_proto_avatar_pb.TESTUploadImageRequest>;
    public tESTUploadImage(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.TESTUploadImageResponse) => void): grpc.ClientWritableStream<grpc_proto_avatar_pb.TESTUploadImageRequest>;
    public tESTUploadImage(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.TESTUploadImageResponse) => void): grpc.ClientWritableStream<grpc_proto_avatar_pb.TESTUploadImageRequest>;
    public tESTUploadImage(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.TESTUploadImageResponse) => void): grpc.ClientWritableStream<grpc_proto_avatar_pb.TESTUploadImageRequest>;
    public delete(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public delete(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public delete(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public getAvatarView(request: grpc_proto_avatar_pb.GetAvatarViewRequest, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.GetAvatarViewResponse) => void): grpc.ClientUnaryCall;
    public getAvatarView(request: grpc_proto_avatar_pb.GetAvatarViewRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.GetAvatarViewResponse) => void): grpc.ClientUnaryCall;
    public getAvatarView(request: grpc_proto_avatar_pb.GetAvatarViewRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: grpc_proto_avatar_pb.GetAvatarViewResponse) => void): grpc.ClientUnaryCall;
}
