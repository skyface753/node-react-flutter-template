// package: template
// file: grpc-proto/avatar.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class Avatar extends jspb.Message { 
    getGeneratedpath(): string;
    setGeneratedpath(value: string): Avatar;
    getOriginalname(): string;
    setOriginalname(value: string): Avatar;
    getType(): string;
    setType(value: string): Avatar;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Avatar.AsObject;
    static toObject(includeInstance: boolean, msg: Avatar): Avatar.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Avatar, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Avatar;
    static deserializeBinaryFromReader(message: Avatar, reader: jspb.BinaryReader): Avatar;
}

export namespace Avatar {
    export type AsObject = {
        generatedpath: string,
        originalname: string,
        type: string,
    }
}

export class UploadUrlRequest extends jspb.Message { 
    getFilename(): string;
    setFilename(value: string): UploadUrlRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UploadUrlRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UploadUrlRequest): UploadUrlRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UploadUrlRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UploadUrlRequest;
    static deserializeBinaryFromReader(message: UploadUrlRequest, reader: jspb.BinaryReader): UploadUrlRequest;
}

export namespace UploadUrlRequest {
    export type AsObject = {
        filename: string,
    }
}

export class UploadUrlResponse extends jspb.Message { 
    getUrl(): string;
    setUrl(value: string): UploadUrlResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UploadUrlResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UploadUrlResponse): UploadUrlResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UploadUrlResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UploadUrlResponse;
    static deserializeBinaryFromReader(message: UploadUrlResponse, reader: jspb.BinaryReader): UploadUrlResponse;
}

export namespace UploadUrlResponse {
    export type AsObject = {
        url: string,
    }
}

export class GetAvatarViewRequest extends jspb.Message { 
    getUserid(): number;
    setUserid(value: number): GetAvatarViewRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetAvatarViewRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetAvatarViewRequest): GetAvatarViewRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetAvatarViewRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetAvatarViewRequest;
    static deserializeBinaryFromReader(message: GetAvatarViewRequest, reader: jspb.BinaryReader): GetAvatarViewRequest;
}

export namespace GetAvatarViewRequest {
    export type AsObject = {
        userid: number,
    }
}

export class GetAvatarViewResponse extends jspb.Message { 
    getUrl(): string;
    setUrl(value: string): GetAvatarViewResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetAvatarViewResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetAvatarViewResponse): GetAvatarViewResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetAvatarViewResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetAvatarViewResponse;
    static deserializeBinaryFromReader(message: GetAvatarViewResponse, reader: jspb.BinaryReader): GetAvatarViewResponse;
}

export namespace GetAvatarViewResponse {
    export type AsObject = {
        url: string,
    }
}

export class ConfirmUploadRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfirmUploadRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ConfirmUploadRequest): ConfirmUploadRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfirmUploadRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfirmUploadRequest;
    static deserializeBinaryFromReader(message: ConfirmUploadRequest, reader: jspb.BinaryReader): ConfirmUploadRequest;
}

export namespace ConfirmUploadRequest {
    export type AsObject = {
    }
}

export class ConfirmUploadResponse extends jspb.Message { 
    getUrl(): string;
    setUrl(value: string): ConfirmUploadResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfirmUploadResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ConfirmUploadResponse): ConfirmUploadResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfirmUploadResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfirmUploadResponse;
    static deserializeBinaryFromReader(message: ConfirmUploadResponse, reader: jspb.BinaryReader): ConfirmUploadResponse;
}

export namespace ConfirmUploadResponse {
    export type AsObject = {
        url: string,
    }
}

export class UploadImageRequest extends jspb.Message { 

    hasInfo(): boolean;
    clearInfo(): void;
    getInfo(): ImageInfo | undefined;
    setInfo(value?: ImageInfo): UploadImageRequest;

    hasChunkData(): boolean;
    clearChunkData(): void;
    getChunkData(): Uint8Array | string;
    getChunkData_asU8(): Uint8Array;
    getChunkData_asB64(): string;
    setChunkData(value: Uint8Array | string): UploadImageRequest;

    getDataCase(): UploadImageRequest.DataCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UploadImageRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UploadImageRequest): UploadImageRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UploadImageRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UploadImageRequest;
    static deserializeBinaryFromReader(message: UploadImageRequest, reader: jspb.BinaryReader): UploadImageRequest;
}

export namespace UploadImageRequest {
    export type AsObject = {
        info?: ImageInfo.AsObject,
        chunkData: Uint8Array | string,
    }

    export enum DataCase {
        DATA_NOT_SET = 0,
        INFO = 1,
        CHUNK_DATA = 2,
    }

}

export class ImageInfo extends jspb.Message { 
    getType(): string;
    setType(value: string): ImageInfo;
    getFilename(): string;
    setFilename(value: string): ImageInfo;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ImageInfo.AsObject;
    static toObject(includeInstance: boolean, msg: ImageInfo): ImageInfo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ImageInfo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ImageInfo;
    static deserializeBinaryFromReader(message: ImageInfo, reader: jspb.BinaryReader): ImageInfo;
}

export namespace ImageInfo {
    export type AsObject = {
        type: string,
        filename: string,
    }
}

export class UploadImageResponse extends jspb.Message { 
    getGeneratedpath(): string;
    setGeneratedpath(value: string): UploadImageResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UploadImageResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UploadImageResponse): UploadImageResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UploadImageResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UploadImageResponse;
    static deserializeBinaryFromReader(message: UploadImageResponse, reader: jspb.BinaryReader): UploadImageResponse;
}

export namespace UploadImageResponse {
    export type AsObject = {
        generatedpath: string,
    }
}