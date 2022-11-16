// package: template
// file: avatar.proto

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

export class UploadRequest extends jspb.Message { 
    getBinary(): Uint8Array | string;
    getBinary_asU8(): Uint8Array;
    getBinary_asB64(): string;
    setBinary(value: Uint8Array | string): UploadRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UploadRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UploadRequest): UploadRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UploadRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UploadRequest;
    static deserializeBinaryFromReader(message: UploadRequest, reader: jspb.BinaryReader): UploadRequest;
}

export namespace UploadRequest {
    export type AsObject = {
        binary: Uint8Array | string,
    }
}

export class UploadResponse extends jspb.Message { 

    hasAvatar(): boolean;
    clearAvatar(): void;
    getAvatar(): Avatar | undefined;
    setAvatar(value?: Avatar): UploadResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UploadResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UploadResponse): UploadResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UploadResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UploadResponse;
    static deserializeBinaryFromReader(message: UploadResponse, reader: jspb.BinaryReader): UploadResponse;
}

export namespace UploadResponse {
    export type AsObject = {
        avatar?: Avatar.AsObject,
    }
}
