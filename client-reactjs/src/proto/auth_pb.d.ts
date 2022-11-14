// package: template
// file: auth.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class User extends jspb.Message { 
    getId(): number;
    setId(value: number): User;
    getUsername(): string;
    setUsername(value: string): User;
    getRole(): Role;
    setRole(value: Role): User;

    hasCreatedAt(): boolean;
    clearCreatedAt(): void;
    getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): User;

    hasUpdatedAt(): boolean;
    clearUpdatedAt(): void;
    getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): User;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): User.AsObject;
    static toObject(includeInstance: boolean, msg: User): User.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): User;
    static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
    export type AsObject = {
        id: number,
        username: string,
        role: Role,
        createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    }
}

export class LoginRequest extends jspb.Message { 
    getUsername(): string;
    setUsername(value: string): LoginRequest;
    getPassword(): string;
    setPassword(value: string): LoginRequest;

    hasTotpcode(): boolean;
    clearTotpcode(): void;
    getTotpcode(): string | undefined;
    setTotpcode(value: string): LoginRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LoginRequest.AsObject;
    static toObject(includeInstance: boolean, msg: LoginRequest): LoginRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LoginRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LoginRequest;
    static deserializeBinaryFromReader(message: LoginRequest, reader: jspb.BinaryReader): LoginRequest;
}

export namespace LoginRequest {
    export type AsObject = {
        username: string,
        password: string,
        totpcode?: string,
    }
}

export class RefreshTokenRequest extends jspb.Message { 
    getRefreshToken(): string;
    setRefreshToken(value: string): RefreshTokenRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RefreshTokenRequest.AsObject;
    static toObject(includeInstance: boolean, msg: RefreshTokenRequest): RefreshTokenRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RefreshTokenRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RefreshTokenRequest;
    static deserializeBinaryFromReader(message: RefreshTokenRequest, reader: jspb.BinaryReader): RefreshTokenRequest;
}

export namespace RefreshTokenRequest {
    export type AsObject = {
        refreshToken: string,
    }
}

export class LogoutRequest extends jspb.Message { 
    getRefreshToken(): string;
    setRefreshToken(value: string): LogoutRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LogoutRequest.AsObject;
    static toObject(includeInstance: boolean, msg: LogoutRequest): LogoutRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LogoutRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LogoutRequest;
    static deserializeBinaryFromReader(message: LogoutRequest, reader: jspb.BinaryReader): LogoutRequest;
}

export namespace LogoutRequest {
    export type AsObject = {
        refreshToken: string,
    }
}

export class LogoutResponse extends jspb.Message { 
    getSuccess(): boolean;
    setSuccess(value: boolean): LogoutResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LogoutResponse.AsObject;
    static toObject(includeInstance: boolean, msg: LogoutResponse): LogoutResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LogoutResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LogoutResponse;
    static deserializeBinaryFromReader(message: LogoutResponse, reader: jspb.BinaryReader): LogoutResponse;
}

export namespace LogoutResponse {
    export type AsObject = {
        success: boolean,
    }
}

export class RegisterRequest extends jspb.Message { 
    getUsername(): string;
    setUsername(value: string): RegisterRequest;
    getPassword(): string;
    setPassword(value: string): RegisterRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RegisterRequest.AsObject;
    static toObject(includeInstance: boolean, msg: RegisterRequest): RegisterRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RegisterRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RegisterRequest;
    static deserializeBinaryFromReader(message: RegisterRequest, reader: jspb.BinaryReader): RegisterRequest;
}

export namespace RegisterRequest {
    export type AsObject = {
        username: string,
        password: string,
    }
}

export class StatusRequest extends jspb.Message { 
    getAccessToken(): string;
    setAccessToken(value: string): StatusRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StatusRequest.AsObject;
    static toObject(includeInstance: boolean, msg: StatusRequest): StatusRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StatusRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StatusRequest;
    static deserializeBinaryFromReader(message: StatusRequest, reader: jspb.BinaryReader): StatusRequest;
}

export namespace StatusRequest {
    export type AsObject = {
        accessToken: string,
    }
}

export class StatusResponse extends jspb.Message { 

    hasUser(): boolean;
    clearUser(): void;
    getUser(): User | undefined;
    setUser(value?: User): StatusResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StatusResponse.AsObject;
    static toObject(includeInstance: boolean, msg: StatusResponse): StatusResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StatusResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StatusResponse;
    static deserializeBinaryFromReader(message: StatusResponse, reader: jspb.BinaryReader): StatusResponse;
}

export namespace StatusResponse {
    export type AsObject = {
        user?: User.AsObject,
    }
}

export class DefaultAuthResponse extends jspb.Message { 
    getAccessToken(): string;
    setAccessToken(value: string): DefaultAuthResponse;
    getRefreshToken(): string;
    setRefreshToken(value: string): DefaultAuthResponse;
    getCsrfToken(): string;
    setCsrfToken(value: string): DefaultAuthResponse;

    hasUser(): boolean;
    clearUser(): void;
    getUser(): User | undefined;
    setUser(value?: User): DefaultAuthResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DefaultAuthResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DefaultAuthResponse): DefaultAuthResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DefaultAuthResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DefaultAuthResponse;
    static deserializeBinaryFromReader(message: DefaultAuthResponse, reader: jspb.BinaryReader): DefaultAuthResponse;
}

export namespace DefaultAuthResponse {
    export type AsObject = {
        accessToken: string,
        refreshToken: string,
        csrfToken: string,
        user?: User.AsObject,
    }
}

export enum Role {
    USER = 0,
    ADMIN = 1,
}
