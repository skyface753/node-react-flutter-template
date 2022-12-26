///
//  Generated code. Do not modify.
//  source: grpc-proto/avatar.proto
//
// @dart = 2.12
// ignore_for_file: annotate_overrides,camel_case_types,constant_identifier_names,directives_ordering,library_prefixes,non_constant_identifier_names,prefer_final_fields,return_of_invalid_type,unnecessary_const,unnecessary_import,unnecessary_this,unused_import,unused_shown_name

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

class Avatar extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'Avatar', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'template'), createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'generatedPath', protoName: 'generatedPath')
    ..aOS(2, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'originalName', protoName: 'originalName')
    ..aOS(3, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'type')
    ..hasRequiredFields = false
  ;

  Avatar._() : super();
  factory Avatar({
    $core.String? generatedPath,
    $core.String? originalName,
    $core.String? type,
  }) {
    final _result = create();
    if (generatedPath != null) {
      _result.generatedPath = generatedPath;
    }
    if (originalName != null) {
      _result.originalName = originalName;
    }
    if (type != null) {
      _result.type = type;
    }
    return _result;
  }
  factory Avatar.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory Avatar.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  Avatar clone() => Avatar()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  Avatar copyWith(void Function(Avatar) updates) => super.copyWith((message) => updates(message as Avatar)) as Avatar; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static Avatar create() => Avatar._();
  Avatar createEmptyInstance() => create();
  static $pb.PbList<Avatar> createRepeated() => $pb.PbList<Avatar>();
  @$core.pragma('dart2js:noInline')
  static Avatar getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<Avatar>(create);
  static Avatar? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get generatedPath => $_getSZ(0);
  @$pb.TagNumber(1)
  set generatedPath($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasGeneratedPath() => $_has(0);
  @$pb.TagNumber(1)
  void clearGeneratedPath() => clearField(1);

  @$pb.TagNumber(2)
  $core.String get originalName => $_getSZ(1);
  @$pb.TagNumber(2)
  set originalName($core.String v) { $_setString(1, v); }
  @$pb.TagNumber(2)
  $core.bool hasOriginalName() => $_has(1);
  @$pb.TagNumber(2)
  void clearOriginalName() => clearField(2);

  @$pb.TagNumber(3)
  $core.String get type => $_getSZ(2);
  @$pb.TagNumber(3)
  set type($core.String v) { $_setString(2, v); }
  @$pb.TagNumber(3)
  $core.bool hasType() => $_has(2);
  @$pb.TagNumber(3)
  void clearType() => clearField(3);
}

class UploadGetUrlRequest extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'UploadGetUrlRequest', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'template'), createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'filename')
    ..hasRequiredFields = false
  ;

  UploadGetUrlRequest._() : super();
  factory UploadGetUrlRequest({
    $core.String? filename,
  }) {
    final _result = create();
    if (filename != null) {
      _result.filename = filename;
    }
    return _result;
  }
  factory UploadGetUrlRequest.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory UploadGetUrlRequest.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  UploadGetUrlRequest clone() => UploadGetUrlRequest()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  UploadGetUrlRequest copyWith(void Function(UploadGetUrlRequest) updates) => super.copyWith((message) => updates(message as UploadGetUrlRequest)) as UploadGetUrlRequest; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static UploadGetUrlRequest create() => UploadGetUrlRequest._();
  UploadGetUrlRequest createEmptyInstance() => create();
  static $pb.PbList<UploadGetUrlRequest> createRepeated() => $pb.PbList<UploadGetUrlRequest>();
  @$core.pragma('dart2js:noInline')
  static UploadGetUrlRequest getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<UploadGetUrlRequest>(create);
  static UploadGetUrlRequest? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get filename => $_getSZ(0);
  @$pb.TagNumber(1)
  set filename($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasFilename() => $_has(0);
  @$pb.TagNumber(1)
  void clearFilename() => clearField(1);
}

class UploadGetUrlResponse extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'UploadGetUrlResponse', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'template'), createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'url')
    ..aOS(2, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'tokenToConfirm', protoName: 'tokenToConfirm')
    ..hasRequiredFields = false
  ;

  UploadGetUrlResponse._() : super();
  factory UploadGetUrlResponse({
    $core.String? url,
    $core.String? tokenToConfirm,
  }) {
    final _result = create();
    if (url != null) {
      _result.url = url;
    }
    if (tokenToConfirm != null) {
      _result.tokenToConfirm = tokenToConfirm;
    }
    return _result;
  }
  factory UploadGetUrlResponse.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory UploadGetUrlResponse.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  UploadGetUrlResponse clone() => UploadGetUrlResponse()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  UploadGetUrlResponse copyWith(void Function(UploadGetUrlResponse) updates) => super.copyWith((message) => updates(message as UploadGetUrlResponse)) as UploadGetUrlResponse; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static UploadGetUrlResponse create() => UploadGetUrlResponse._();
  UploadGetUrlResponse createEmptyInstance() => create();
  static $pb.PbList<UploadGetUrlResponse> createRepeated() => $pb.PbList<UploadGetUrlResponse>();
  @$core.pragma('dart2js:noInline')
  static UploadGetUrlResponse getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<UploadGetUrlResponse>(create);
  static UploadGetUrlResponse? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get url => $_getSZ(0);
  @$pb.TagNumber(1)
  set url($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasUrl() => $_has(0);
  @$pb.TagNumber(1)
  void clearUrl() => clearField(1);

  @$pb.TagNumber(2)
  $core.String get tokenToConfirm => $_getSZ(1);
  @$pb.TagNumber(2)
  set tokenToConfirm($core.String v) { $_setString(1, v); }
  @$pb.TagNumber(2)
  $core.bool hasTokenToConfirm() => $_has(1);
  @$pb.TagNumber(2)
  void clearTokenToConfirm() => clearField(2);
}

class UploadConfirmRequest extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'UploadConfirmRequest', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'template'), createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'token')
    ..hasRequiredFields = false
  ;

  UploadConfirmRequest._() : super();
  factory UploadConfirmRequest({
    $core.String? token,
  }) {
    final _result = create();
    if (token != null) {
      _result.token = token;
    }
    return _result;
  }
  factory UploadConfirmRequest.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory UploadConfirmRequest.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  UploadConfirmRequest clone() => UploadConfirmRequest()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  UploadConfirmRequest copyWith(void Function(UploadConfirmRequest) updates) => super.copyWith((message) => updates(message as UploadConfirmRequest)) as UploadConfirmRequest; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static UploadConfirmRequest create() => UploadConfirmRequest._();
  UploadConfirmRequest createEmptyInstance() => create();
  static $pb.PbList<UploadConfirmRequest> createRepeated() => $pb.PbList<UploadConfirmRequest>();
  @$core.pragma('dart2js:noInline')
  static UploadConfirmRequest getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<UploadConfirmRequest>(create);
  static UploadConfirmRequest? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get token => $_getSZ(0);
  @$pb.TagNumber(1)
  set token($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasToken() => $_has(0);
  @$pb.TagNumber(1)
  void clearToken() => clearField(1);
}

class UploadConfirmResponse extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'UploadConfirmResponse', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'template'), createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'url')
    ..hasRequiredFields = false
  ;

  UploadConfirmResponse._() : super();
  factory UploadConfirmResponse({
    $core.String? url,
  }) {
    final _result = create();
    if (url != null) {
      _result.url = url;
    }
    return _result;
  }
  factory UploadConfirmResponse.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory UploadConfirmResponse.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  UploadConfirmResponse clone() => UploadConfirmResponse()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  UploadConfirmResponse copyWith(void Function(UploadConfirmResponse) updates) => super.copyWith((message) => updates(message as UploadConfirmResponse)) as UploadConfirmResponse; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static UploadConfirmResponse create() => UploadConfirmResponse._();
  UploadConfirmResponse createEmptyInstance() => create();
  static $pb.PbList<UploadConfirmResponse> createRepeated() => $pb.PbList<UploadConfirmResponse>();
  @$core.pragma('dart2js:noInline')
  static UploadConfirmResponse getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<UploadConfirmResponse>(create);
  static UploadConfirmResponse? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get url => $_getSZ(0);
  @$pb.TagNumber(1)
  set url($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasUrl() => $_has(0);
  @$pb.TagNumber(1)
  void clearUrl() => clearField(1);
}

class GetAvatarViewRequest extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'GetAvatarViewRequest', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'template'), createEmptyInstance: create)
    ..a<$core.int>(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'userId', $pb.PbFieldType.O3, protoName: 'userId')
    ..hasRequiredFields = false
  ;

  GetAvatarViewRequest._() : super();
  factory GetAvatarViewRequest({
    $core.int? userId,
  }) {
    final _result = create();
    if (userId != null) {
      _result.userId = userId;
    }
    return _result;
  }
  factory GetAvatarViewRequest.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory GetAvatarViewRequest.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  GetAvatarViewRequest clone() => GetAvatarViewRequest()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  GetAvatarViewRequest copyWith(void Function(GetAvatarViewRequest) updates) => super.copyWith((message) => updates(message as GetAvatarViewRequest)) as GetAvatarViewRequest; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static GetAvatarViewRequest create() => GetAvatarViewRequest._();
  GetAvatarViewRequest createEmptyInstance() => create();
  static $pb.PbList<GetAvatarViewRequest> createRepeated() => $pb.PbList<GetAvatarViewRequest>();
  @$core.pragma('dart2js:noInline')
  static GetAvatarViewRequest getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<GetAvatarViewRequest>(create);
  static GetAvatarViewRequest? _defaultInstance;

  @$pb.TagNumber(1)
  $core.int get userId => $_getIZ(0);
  @$pb.TagNumber(1)
  set userId($core.int v) { $_setSignedInt32(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasUserId() => $_has(0);
  @$pb.TagNumber(1)
  void clearUserId() => clearField(1);
}

class GetAvatarViewResponse extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'GetAvatarViewResponse', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'template'), createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'url')
    ..hasRequiredFields = false
  ;

  GetAvatarViewResponse._() : super();
  factory GetAvatarViewResponse({
    $core.String? url,
  }) {
    final _result = create();
    if (url != null) {
      _result.url = url;
    }
    return _result;
  }
  factory GetAvatarViewResponse.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory GetAvatarViewResponse.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  GetAvatarViewResponse clone() => GetAvatarViewResponse()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  GetAvatarViewResponse copyWith(void Function(GetAvatarViewResponse) updates) => super.copyWith((message) => updates(message as GetAvatarViewResponse)) as GetAvatarViewResponse; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static GetAvatarViewResponse create() => GetAvatarViewResponse._();
  GetAvatarViewResponse createEmptyInstance() => create();
  static $pb.PbList<GetAvatarViewResponse> createRepeated() => $pb.PbList<GetAvatarViewResponse>();
  @$core.pragma('dart2js:noInline')
  static GetAvatarViewResponse getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<GetAvatarViewResponse>(create);
  static GetAvatarViewResponse? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get url => $_getSZ(0);
  @$pb.TagNumber(1)
  set url($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasUrl() => $_has(0);
  @$pb.TagNumber(1)
  void clearUrl() => clearField(1);
}

enum TESTUploadImageRequest_Data {
  info, 
  chunkData, 
  notSet
}

class TESTUploadImageRequest extends $pb.GeneratedMessage {
  static const $core.Map<$core.int, TESTUploadImageRequest_Data> _TESTUploadImageRequest_DataByTag = {
    1 : TESTUploadImageRequest_Data.info,
    2 : TESTUploadImageRequest_Data.chunkData,
    0 : TESTUploadImageRequest_Data.notSet
  };
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'TESTUploadImageRequest', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'template'), createEmptyInstance: create)
    ..oo(0, [1, 2])
    ..aOM<TESTImageInfo>(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'info', subBuilder: TESTImageInfo.create)
    ..a<$core.List<$core.int>>(2, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'chunkData', $pb.PbFieldType.OY)
    ..hasRequiredFields = false
  ;

  TESTUploadImageRequest._() : super();
  factory TESTUploadImageRequest({
    TESTImageInfo? info,
    $core.List<$core.int>? chunkData,
  }) {
    final _result = create();
    if (info != null) {
      _result.info = info;
    }
    if (chunkData != null) {
      _result.chunkData = chunkData;
    }
    return _result;
  }
  factory TESTUploadImageRequest.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory TESTUploadImageRequest.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  TESTUploadImageRequest clone() => TESTUploadImageRequest()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  TESTUploadImageRequest copyWith(void Function(TESTUploadImageRequest) updates) => super.copyWith((message) => updates(message as TESTUploadImageRequest)) as TESTUploadImageRequest; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static TESTUploadImageRequest create() => TESTUploadImageRequest._();
  TESTUploadImageRequest createEmptyInstance() => create();
  static $pb.PbList<TESTUploadImageRequest> createRepeated() => $pb.PbList<TESTUploadImageRequest>();
  @$core.pragma('dart2js:noInline')
  static TESTUploadImageRequest getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<TESTUploadImageRequest>(create);
  static TESTUploadImageRequest? _defaultInstance;

  TESTUploadImageRequest_Data whichData() => _TESTUploadImageRequest_DataByTag[$_whichOneof(0)]!;
  void clearData() => clearField($_whichOneof(0));

  @$pb.TagNumber(1)
  TESTImageInfo get info => $_getN(0);
  @$pb.TagNumber(1)
  set info(TESTImageInfo v) { setField(1, v); }
  @$pb.TagNumber(1)
  $core.bool hasInfo() => $_has(0);
  @$pb.TagNumber(1)
  void clearInfo() => clearField(1);
  @$pb.TagNumber(1)
  TESTImageInfo ensureInfo() => $_ensure(0);

  @$pb.TagNumber(2)
  $core.List<$core.int> get chunkData => $_getN(1);
  @$pb.TagNumber(2)
  set chunkData($core.List<$core.int> v) { $_setBytes(1, v); }
  @$pb.TagNumber(2)
  $core.bool hasChunkData() => $_has(1);
  @$pb.TagNumber(2)
  void clearChunkData() => clearField(2);
}

class TESTImageInfo extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'TESTImageInfo', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'template'), createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'type')
    ..aOS(2, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'filename')
    ..hasRequiredFields = false
  ;

  TESTImageInfo._() : super();
  factory TESTImageInfo({
    $core.String? type,
    $core.String? filename,
  }) {
    final _result = create();
    if (type != null) {
      _result.type = type;
    }
    if (filename != null) {
      _result.filename = filename;
    }
    return _result;
  }
  factory TESTImageInfo.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory TESTImageInfo.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  TESTImageInfo clone() => TESTImageInfo()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  TESTImageInfo copyWith(void Function(TESTImageInfo) updates) => super.copyWith((message) => updates(message as TESTImageInfo)) as TESTImageInfo; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static TESTImageInfo create() => TESTImageInfo._();
  TESTImageInfo createEmptyInstance() => create();
  static $pb.PbList<TESTImageInfo> createRepeated() => $pb.PbList<TESTImageInfo>();
  @$core.pragma('dart2js:noInline')
  static TESTImageInfo getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<TESTImageInfo>(create);
  static TESTImageInfo? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get type => $_getSZ(0);
  @$pb.TagNumber(1)
  set type($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasType() => $_has(0);
  @$pb.TagNumber(1)
  void clearType() => clearField(1);

  @$pb.TagNumber(2)
  $core.String get filename => $_getSZ(1);
  @$pb.TagNumber(2)
  set filename($core.String v) { $_setString(1, v); }
  @$pb.TagNumber(2)
  $core.bool hasFilename() => $_has(1);
  @$pb.TagNumber(2)
  void clearFilename() => clearField(2);
}

class TESTUploadImageResponse extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'TESTUploadImageResponse', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'template'), createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'generatedPath', protoName: 'generatedPath')
    ..hasRequiredFields = false
  ;

  TESTUploadImageResponse._() : super();
  factory TESTUploadImageResponse({
    $core.String? generatedPath,
  }) {
    final _result = create();
    if (generatedPath != null) {
      _result.generatedPath = generatedPath;
    }
    return _result;
  }
  factory TESTUploadImageResponse.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory TESTUploadImageResponse.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  TESTUploadImageResponse clone() => TESTUploadImageResponse()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  TESTUploadImageResponse copyWith(void Function(TESTUploadImageResponse) updates) => super.copyWith((message) => updates(message as TESTUploadImageResponse)) as TESTUploadImageResponse; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static TESTUploadImageResponse create() => TESTUploadImageResponse._();
  TESTUploadImageResponse createEmptyInstance() => create();
  static $pb.PbList<TESTUploadImageResponse> createRepeated() => $pb.PbList<TESTUploadImageResponse>();
  @$core.pragma('dart2js:noInline')
  static TESTUploadImageResponse getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<TESTUploadImageResponse>(create);
  static TESTUploadImageResponse? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get generatedPath => $_getSZ(0);
  @$pb.TagNumber(1)
  set generatedPath($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasGeneratedPath() => $_has(0);
  @$pb.TagNumber(1)
  void clearGeneratedPath() => clearField(1);
}

