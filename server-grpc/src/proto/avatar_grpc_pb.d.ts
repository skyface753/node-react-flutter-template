// package: template
// file: avatar.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as avatar_pb from "./avatar_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IAvatarServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    upload: IAvatarServiceService_IUpload;
    delete: IAvatarServiceService_IDelete;
}

interface IAvatarServiceService_IUpload extends grpc.MethodDefinition<avatar_pb.UploadRequest, avatar_pb.UploadResponse> {
    path: "/template.AvatarService/Upload";
    requestStream: true;
    responseStream: false;
    requestSerialize: grpc.serialize<avatar_pb.UploadRequest>;
    requestDeserialize: grpc.deserialize<avatar_pb.UploadRequest>;
    responseSerialize: grpc.serialize<avatar_pb.UploadResponse>;
    responseDeserialize: grpc.deserialize<avatar_pb.UploadResponse>;
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

export const AvatarServiceService: IAvatarServiceService;

export interface IAvatarServiceServer extends grpc.UntypedServiceImplementation {
    upload: grpc.handleClientStreamingCall<avatar_pb.UploadRequest, avatar_pb.UploadResponse>;
    delete: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, google_protobuf_empty_pb.Empty>;
}

export interface IAvatarServiceClient {
    upload(callback: (error: grpc.ServiceError | null, response: avatar_pb.UploadResponse) => void): grpc.ClientWritableStream<avatar_pb.UploadRequest>;
    upload(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: avatar_pb.UploadResponse) => void): grpc.ClientWritableStream<avatar_pb.UploadRequest>;
    upload(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: avatar_pb.UploadResponse) => void): grpc.ClientWritableStream<avatar_pb.UploadRequest>;
    upload(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: avatar_pb.UploadResponse) => void): grpc.ClientWritableStream<avatar_pb.UploadRequest>;
    delete(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    delete(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    delete(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class AvatarServiceClient extends grpc.Client implements IAvatarServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public upload(callback: (error: grpc.ServiceError | null, response: avatar_pb.UploadResponse) => void): grpc.ClientWritableStream<avatar_pb.UploadRequest>;
    public upload(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: avatar_pb.UploadResponse) => void): grpc.ClientWritableStream<avatar_pb.UploadRequest>;
    public upload(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: avatar_pb.UploadResponse) => void): grpc.ClientWritableStream<avatar_pb.UploadRequest>;
    public upload(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: avatar_pb.UploadResponse) => void): grpc.ClientWritableStream<avatar_pb.UploadRequest>;
    public delete(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public delete(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public delete(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}
