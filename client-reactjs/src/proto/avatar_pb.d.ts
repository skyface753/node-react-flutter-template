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
