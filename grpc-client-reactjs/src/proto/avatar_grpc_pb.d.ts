// package: template
// file: avatar.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as avatar_pb from "./avatar_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IAvatarServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    requestAUploadURL: IAvatarServiceService_IRequestAUploadURL;
    delete: IAvatarServiceService_IDelete;
}

interface IAvatarServiceService_IRequestAUploadURL extends grpc.MethodDefinition<avatar_pb.UploadUrlRequest, avatar_pb.UploadUrlResponse> {
    path: "/template.AvatarService/RequestAUploadURL";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<avatar_pb.UploadUrlRequest>;
    requestDeserialize: grpc.deserialize<avatar_pb.UploadUrlRequest>;
    responseSerialize: grpc.serialize<avatar_pb.UploadUrlResponse>;
    responseDeserialize: grpc.deserialize<avatar_pb.UploadUrlResponse>;
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
    requestAUploadURL: grpc.handleUnaryCall<avatar_pb.UploadUrlRequest, avatar_pb.UploadUrlResponse>;
    delete: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, google_protobuf_empty_pb.Empty>;
}

export interface IAvatarServiceClient {
    requestAUploadURL(request: avatar_pb.UploadUrlRequest, callback: (error: grpc.ServiceError | null, response: avatar_pb.UploadUrlResponse) => void): grpc.ClientUnaryCall;
    requestAUploadURL(request: avatar_pb.UploadUrlRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: avatar_pb.UploadUrlResponse) => void): grpc.ClientUnaryCall;
    requestAUploadURL(request: avatar_pb.UploadUrlRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: avatar_pb.UploadUrlResponse) => void): grpc.ClientUnaryCall;
    delete(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    delete(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    delete(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class AvatarServiceClient extends grpc.Client implements IAvatarServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public requestAUploadURL(request: avatar_pb.UploadUrlRequest, callback: (error: grpc.ServiceError | null, response: avatar_pb.UploadUrlResponse) => void): grpc.ClientUnaryCall;
    public requestAUploadURL(request: avatar_pb.UploadUrlRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: avatar_pb.UploadUrlResponse) => void): grpc.ClientUnaryCall;
    public requestAUploadURL(request: avatar_pb.UploadUrlRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: avatar_pb.UploadUrlResponse) => void): grpc.ClientUnaryCall;
    public delete(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public delete(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public delete(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}
