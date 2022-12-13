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

export class UploadGetUrlRequest extends jspb.Message { 
    getFilename(): string;
    setFilename(value: string): UploadGetUrlRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UploadGetUrlRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UploadGetUrlRequest): UploadGetUrlRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UploadGetUrlRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UploadGetUrlRequest;
    static deserializeBinaryFromReader(message: UploadGetUrlRequest, reader: jspb.BinaryReader): UploadGetUrlRequest;
}

export namespace UploadGetUrlRequest {
    export type AsObject = {
        filename: string,
    }
}

export class UploadGetUrlResponse extends jspb.Message { 
    getUrl(): string;
    setUrl(value: string): UploadGetUrlResponse;
    getTokentoconfirm(): string;
    setTokentoconfirm(value: string): UploadGetUrlResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UploadGetUrlResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UploadGetUrlResponse): UploadGetUrlResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UploadGetUrlResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UploadGetUrlResponse;
    static deserializeBinaryFromReader(message: UploadGetUrlResponse, reader: jspb.BinaryReader): UploadGetUrlResponse;
}

export namespace UploadGetUrlResponse {
    export type AsObject = {
        url: string,
        tokentoconfirm: string,
    }
}

export class UploadConfirmRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): UploadConfirmRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UploadConfirmRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UploadConfirmRequest): UploadConfirmRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UploadConfirmRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UploadConfirmRequest;
    static deserializeBinaryFromReader(message: UploadConfirmRequest, reader: jspb.BinaryReader): UploadConfirmRequest;
}

export namespace UploadConfirmRequest {
    export type AsObject = {
        token: string,
    }
}

export class UploadConfirmResponse extends jspb.Message { 
    getUrl(): string;
    setUrl(value: string): UploadConfirmResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UploadConfirmResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UploadConfirmResponse): UploadConfirmResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UploadConfirmResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UploadConfirmResponse;
    static deserializeBinaryFromReader(message: UploadConfirmResponse, reader: jspb.BinaryReader): UploadConfirmResponse;
}

export namespace UploadConfirmResponse {
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

export class TESTUploadImageRequest extends jspb.Message { 

    hasInfo(): boolean;
    clearInfo(): void;
    getInfo(): TESTImageInfo | undefined;
    setInfo(value?: TESTImageInfo): TESTUploadImageRequest;

    hasChunkData(): boolean;
    clearChunkData(): void;
    getChunkData(): Uint8Array | string;
    getChunkData_asU8(): Uint8Array;
    getChunkData_asB64(): string;
    setChunkData(value: Uint8Array | string): TESTUploadImageRequest;

    getDataCase(): TESTUploadImageRequest.DataCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TESTUploadImageRequest.AsObject;
    static toObject(includeInstance: boolean, msg: TESTUploadImageRequest): TESTUploadImageRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TESTUploadImageRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TESTUploadImageRequest;
    static deserializeBinaryFromReader(message: TESTUploadImageRequest, reader: jspb.BinaryReader): TESTUploadImageRequest;
}

export namespace TESTUploadImageRequest {
    export type AsObject = {
        info?: TESTImageInfo.AsObject,
        chunkData: Uint8Array | string,
    }

    export enum DataCase {
        DATA_NOT_SET = 0,
        INFO = 1,
        CHUNK_DATA = 2,
    }

}

export class TESTImageInfo extends jspb.Message { 
    getType(): string;
    setType(value: string): TESTImageInfo;
    getFilename(): string;
    setFilename(value: string): TESTImageInfo;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TESTImageInfo.AsObject;
    static toObject(includeInstance: boolean, msg: TESTImageInfo): TESTImageInfo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TESTImageInfo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TESTImageInfo;
    static deserializeBinaryFromReader(message: TESTImageInfo, reader: jspb.BinaryReader): TESTImageInfo;
}

export namespace TESTImageInfo {
    export type AsObject = {
        type: string,
        filename: string,
    }
}

export class TESTUploadImageResponse extends jspb.Message { 
    getGeneratedpath(): string;
    setGeneratedpath(value: string): TESTUploadImageResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TESTUploadImageResponse.AsObject;
    static toObject(includeInstance: boolean, msg: TESTUploadImageResponse): TESTUploadImageResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TESTUploadImageResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TESTUploadImageResponse;
    static deserializeBinaryFromReader(message: TESTUploadImageResponse, reader: jspb.BinaryReader): TESTUploadImageResponse;
}

export namespace TESTUploadImageResponse {
    export type AsObject = {
        generatedpath: string,
    }
}
