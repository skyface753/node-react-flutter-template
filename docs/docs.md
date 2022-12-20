# Protocol Documentation
<a name="top"></a>

## Table of Contents

- [auth.proto](#auth-proto)
    - [DefaultAuthResponse](#template-DefaultAuthResponse)
    - [DisableTOTPRequest](#template-DisableTOTPRequest)
    - [DisableTOTPResponse](#template-DisableTOTPResponse)
    - [EnableTOTPRequest](#template-EnableTOTPRequest)
    - [EnableTOTPResponse](#template-EnableTOTPResponse)
    - [LoginRequest](#template-LoginRequest)
    - [LogoutRequest](#template-LogoutRequest)
    - [LogoutResponse](#template-LogoutResponse)
    - [RefreshTokenRequest](#template-RefreshTokenRequest)
    - [RegisterRequest](#template-RegisterRequest)
    - [StatusRequest](#template-StatusRequest)
    - [StatusResponse](#template-StatusResponse)
    - [User](#template-User)
    - [VerifyTOTPRequest](#template-VerifyTOTPRequest)
    - [VerifyTOTPResponse](#template-VerifyTOTPResponse)
  
    - [Role](#template-Role)
  
    - [AuthService](#template-AuthService)
  
- [avatar.proto](#avatar-proto)
    - [Avatar](#template-Avatar)
    - [GetAvatarViewRequest](#template-GetAvatarViewRequest)
    - [GetAvatarViewResponse](#template-GetAvatarViewResponse)
    - [TESTImageInfo](#template-TESTImageInfo)
    - [TESTUploadImageRequest](#template-TESTUploadImageRequest)
    - [TESTUploadImageResponse](#template-TESTUploadImageResponse)
    - [UploadConfirmRequest](#template-UploadConfirmRequest)
    - [UploadConfirmResponse](#template-UploadConfirmResponse)
    - [UploadGetUrlRequest](#template-UploadGetUrlRequest)
    - [UploadGetUrlResponse](#template-UploadGetUrlResponse)
  
    - [AvatarService](#template-AvatarService)
  
- [Scalar Value Types](#scalar-value-types)



<a name="auth-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## auth.proto



<a name="template-DefaultAuthResponse"></a>

### DefaultAuthResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| access_token | [string](#string) |  |  |
| refresh_token | [string](#string) |  |  |
| csrf_token | [string](#string) |  |  |
| user | [User](#template-User) |  |  |






<a name="template-DisableTOTPRequest"></a>

### DisableTOTPRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| password | [string](#string) |  |  |
| totpCode | [string](#string) |  |  |






<a name="template-DisableTOTPResponse"></a>

### DisableTOTPResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| success | [bool](#bool) |  |  |






<a name="template-EnableTOTPRequest"></a>

### EnableTOTPRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| password | [string](#string) |  |  |






<a name="template-EnableTOTPResponse"></a>

### EnableTOTPResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| secret | [string](#string) |  |  |
| url | [string](#string) |  | QR code url |






<a name="template-LoginRequest"></a>

### LoginRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| username | [string](#string) |  |  |
| password | [string](#string) |  |  |
| totpCode | [string](#string) | optional |  |






<a name="template-LogoutRequest"></a>

### LogoutRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| refresh_token | [string](#string) |  |  |






<a name="template-LogoutResponse"></a>

### LogoutResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| success | [bool](#bool) |  |  |






<a name="template-RefreshTokenRequest"></a>

### RefreshTokenRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| refresh_token | [string](#string) |  |  |






<a name="template-RegisterRequest"></a>

### RegisterRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| username | [string](#string) |  |  |
| password | [string](#string) |  |  |






<a name="template-StatusRequest"></a>

### StatusRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| access_token | [string](#string) |  |  |






<a name="template-StatusResponse"></a>

### StatusResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| user | [User](#template-User) |  |  |
| totpEnabled | [bool](#bool) |  |  |






<a name="template-User"></a>

### User



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  |  |
| username | [string](#string) |  |  |
| role | [Role](#template-Role) |  |  |
| avatar | [string](#string) |  |  |
| created_at | [google.protobuf.Timestamp](#google-protobuf-Timestamp) |  |  |
| updated_at | [google.protobuf.Timestamp](#google-protobuf-Timestamp) |  |  |






<a name="template-VerifyTOTPRequest"></a>

### VerifyTOTPRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| totpCode | [string](#string) |  |  |






<a name="template-VerifyTOTPResponse"></a>

### VerifyTOTPResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| success | [bool](#bool) |  |  |





 


<a name="template-Role"></a>

### Role


| Name | Number | Description |
| ---- | ------ | ----------- |
| USER | 0 |  |
| ADMIN | 1 |  |


 

 


<a name="template-AuthService"></a>

### AuthService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Login | [LoginRequest](#template-LoginRequest) | [DefaultAuthResponse](#template-DefaultAuthResponse) |  |
| RefreshToken | [RefreshTokenRequest](#template-RefreshTokenRequest) | [DefaultAuthResponse](#template-DefaultAuthResponse) |  |
| Logout | [LogoutRequest](#template-LogoutRequest) | [LogoutResponse](#template-LogoutResponse) |  |
| Register | [RegisterRequest](#template-RegisterRequest) | [DefaultAuthResponse](#template-DefaultAuthResponse) |  |
| Status | [StatusRequest](#template-StatusRequest) | [StatusResponse](#template-StatusResponse) |  |
| DisableTOTP | [DisableTOTPRequest](#template-DisableTOTPRequest) | [DisableTOTPResponse](#template-DisableTOTPResponse) |  |
| EnableTOTP | [EnableTOTPRequest](#template-EnableTOTPRequest) | [EnableTOTPResponse](#template-EnableTOTPResponse) |  |
| VerifyTOTP | [VerifyTOTPRequest](#template-VerifyTOTPRequest) | [VerifyTOTPResponse](#template-VerifyTOTPResponse) |  |

 



<a name="avatar-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## avatar.proto



<a name="template-Avatar"></a>

### Avatar



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| generatedPath | [string](#string) |  |  |
| originalName | [string](#string) |  |  |
| type | [string](#string) |  |  |






<a name="template-GetAvatarViewRequest"></a>

### GetAvatarViewRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| userId | [int32](#int32) |  |  |






<a name="template-GetAvatarViewResponse"></a>

### GetAvatarViewResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| url | [string](#string) |  |  |






<a name="template-TESTImageInfo"></a>

### TESTImageInfo



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| type | [string](#string) |  |  |
| filename | [string](#string) |  |  |






<a name="template-TESTUploadImageRequest"></a>

### TESTUploadImageRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| info | [TESTImageInfo](#template-TESTImageInfo) |  |  |
| chunk_data | [bytes](#bytes) |  |  |






<a name="template-TESTUploadImageResponse"></a>

### TESTUploadImageResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| generatedPath | [string](#string) |  |  |






<a name="template-UploadConfirmRequest"></a>

### UploadConfirmRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| token | [string](#string) |  | token to confirm upload (filename, originalname, type) -&gt; save to db |






<a name="template-UploadConfirmResponse"></a>

### UploadConfirmResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| url | [string](#string) |  | url to get avatar from s3 |






<a name="template-UploadGetUrlRequest"></a>

### UploadGetUrlRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| filename | [string](#string) |  |  |






<a name="template-UploadGetUrlResponse"></a>

### UploadGetUrlResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| url | [string](#string) |  | url to upload to s3 |
| tokenToConfirm | [string](#string) |  | token to confirm upload (filename, originalname, type) -&gt; save to db |





 

 

 


<a name="template-AvatarService"></a>

### AvatarService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetUploadURL | [UploadGetUrlRequest](#template-UploadGetUrlRequest) | [UploadGetUrlResponse](#template-UploadGetUrlResponse) | rpc RequestAUploadURL(UploadUrlRequest) returns (UploadUrlResponse); |
| ConfirmUpload | [UploadConfirmRequest](#template-UploadConfirmRequest) | [UploadConfirmResponse](#template-UploadConfirmResponse) |  |
| TESTUploadImage | [TESTUploadImageRequest](#template-TESTUploadImageRequest) stream | [TESTUploadImageResponse](#template-TESTUploadImageResponse) |  |
| Delete | [.google.protobuf.Empty](#google-protobuf-Empty) | [.google.protobuf.Empty](#google-protobuf-Empty) |  |
| GetAvatarView | [GetAvatarViewRequest](#template-GetAvatarViewRequest) | [GetAvatarViewResponse](#template-GetAvatarViewResponse) |  |

 



## Scalar Value Types

| .proto Type | Notes | C++ | Java | Python | Go | C# | PHP | Ruby |
| ----------- | ----- | --- | ---- | ------ | -- | -- | --- | ---- |
| <a name="double" /> double |  | double | double | float | float64 | double | float | Float |
| <a name="float" /> float |  | float | float | float | float32 | float | float | Float |
| <a name="int32" /> int32 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="int64" /> int64 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="uint32" /> uint32 | Uses variable-length encoding. | uint32 | int | int/long | uint32 | uint | integer | Bignum or Fixnum (as required) |
| <a name="uint64" /> uint64 | Uses variable-length encoding. | uint64 | long | int/long | uint64 | ulong | integer/string | Bignum or Fixnum (as required) |
| <a name="sint32" /> sint32 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="sint64" /> sint64 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="fixed32" /> fixed32 | Always four bytes. More efficient than uint32 if values are often greater than 2^28. | uint32 | int | int | uint32 | uint | integer | Bignum or Fixnum (as required) |
| <a name="fixed64" /> fixed64 | Always eight bytes. More efficient than uint64 if values are often greater than 2^56. | uint64 | long | int/long | uint64 | ulong | integer/string | Bignum |
| <a name="sfixed32" /> sfixed32 | Always four bytes. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="sfixed64" /> sfixed64 | Always eight bytes. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="bool" /> bool |  | bool | boolean | boolean | bool | bool | boolean | TrueClass/FalseClass |
| <a name="string" /> string | A string must always contain UTF-8 encoded or 7-bit ASCII text. | string | String | str/unicode | string | string | string | String (UTF-8) |
| <a name="bytes" /> bytes | May contain any arbitrary sequence of bytes. | string | ByteString | str | []byte | ByteString | string | String (ASCII-8BIT) |

