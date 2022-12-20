// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.21.12
// source: grpc-proto/avatar.proto

package template

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// AvatarServiceClient is the client API for AvatarService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type AvatarServiceClient interface {
	// rpc RequestAUploadURL(UploadUrlRequest) returns (UploadUrlResponse);
	GetUploadURL(ctx context.Context, in *UploadGetUrlRequest, opts ...grpc.CallOption) (*UploadGetUrlResponse, error)
	ConfirmUpload(ctx context.Context, in *UploadConfirmRequest, opts ...grpc.CallOption) (*UploadConfirmResponse, error)
	TESTUploadImage(ctx context.Context, opts ...grpc.CallOption) (AvatarService_TESTUploadImageClient, error)
	Delete(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*emptypb.Empty, error)
	GetAvatarView(ctx context.Context, in *GetAvatarViewRequest, opts ...grpc.CallOption) (*GetAvatarViewResponse, error)
}

type avatarServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewAvatarServiceClient(cc grpc.ClientConnInterface) AvatarServiceClient {
	return &avatarServiceClient{cc}
}

func (c *avatarServiceClient) GetUploadURL(ctx context.Context, in *UploadGetUrlRequest, opts ...grpc.CallOption) (*UploadGetUrlResponse, error) {
	out := new(UploadGetUrlResponse)
	err := c.cc.Invoke(ctx, "/template.AvatarService/GetUploadURL", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *avatarServiceClient) ConfirmUpload(ctx context.Context, in *UploadConfirmRequest, opts ...grpc.CallOption) (*UploadConfirmResponse, error) {
	out := new(UploadConfirmResponse)
	err := c.cc.Invoke(ctx, "/template.AvatarService/ConfirmUpload", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *avatarServiceClient) TESTUploadImage(ctx context.Context, opts ...grpc.CallOption) (AvatarService_TESTUploadImageClient, error) {
	stream, err := c.cc.NewStream(ctx, &AvatarService_ServiceDesc.Streams[0], "/template.AvatarService/TESTUploadImage", opts...)
	if err != nil {
		return nil, err
	}
	x := &avatarServiceTESTUploadImageClient{stream}
	return x, nil
}

type AvatarService_TESTUploadImageClient interface {
	Send(*TESTUploadImageRequest) error
	CloseAndRecv() (*TESTUploadImageResponse, error)
	grpc.ClientStream
}

type avatarServiceTESTUploadImageClient struct {
	grpc.ClientStream
}

func (x *avatarServiceTESTUploadImageClient) Send(m *TESTUploadImageRequest) error {
	return x.ClientStream.SendMsg(m)
}

func (x *avatarServiceTESTUploadImageClient) CloseAndRecv() (*TESTUploadImageResponse, error) {
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	m := new(TESTUploadImageResponse)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

func (c *avatarServiceClient) Delete(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, "/template.AvatarService/Delete", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *avatarServiceClient) GetAvatarView(ctx context.Context, in *GetAvatarViewRequest, opts ...grpc.CallOption) (*GetAvatarViewResponse, error) {
	out := new(GetAvatarViewResponse)
	err := c.cc.Invoke(ctx, "/template.AvatarService/GetAvatarView", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// AvatarServiceServer is the server API for AvatarService service.
// All implementations must embed UnimplementedAvatarServiceServer
// for forward compatibility
type AvatarServiceServer interface {
	// rpc RequestAUploadURL(UploadUrlRequest) returns (UploadUrlResponse);
	GetUploadURL(context.Context, *UploadGetUrlRequest) (*UploadGetUrlResponse, error)
	ConfirmUpload(context.Context, *UploadConfirmRequest) (*UploadConfirmResponse, error)
	TESTUploadImage(AvatarService_TESTUploadImageServer) error
	Delete(context.Context, *emptypb.Empty) (*emptypb.Empty, error)
	GetAvatarView(context.Context, *GetAvatarViewRequest) (*GetAvatarViewResponse, error)
	mustEmbedUnimplementedAvatarServiceServer()
}

// UnimplementedAvatarServiceServer must be embedded to have forward compatible implementations.
type UnimplementedAvatarServiceServer struct {
}

func (UnimplementedAvatarServiceServer) GetUploadURL(context.Context, *UploadGetUrlRequest) (*UploadGetUrlResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetUploadURL not implemented")
}
func (UnimplementedAvatarServiceServer) ConfirmUpload(context.Context, *UploadConfirmRequest) (*UploadConfirmResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ConfirmUpload not implemented")
}
func (UnimplementedAvatarServiceServer) TESTUploadImage(AvatarService_TESTUploadImageServer) error {
	return status.Errorf(codes.Unimplemented, "method TESTUploadImage not implemented")
}
func (UnimplementedAvatarServiceServer) Delete(context.Context, *emptypb.Empty) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Delete not implemented")
}
func (UnimplementedAvatarServiceServer) GetAvatarView(context.Context, *GetAvatarViewRequest) (*GetAvatarViewResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetAvatarView not implemented")
}
func (UnimplementedAvatarServiceServer) mustEmbedUnimplementedAvatarServiceServer() {}

// UnsafeAvatarServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to AvatarServiceServer will
// result in compilation errors.
type UnsafeAvatarServiceServer interface {
	mustEmbedUnimplementedAvatarServiceServer()
}

func RegisterAvatarServiceServer(s grpc.ServiceRegistrar, srv AvatarServiceServer) {
	s.RegisterService(&AvatarService_ServiceDesc, srv)
}

func _AvatarService_GetUploadURL_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UploadGetUrlRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AvatarServiceServer).GetUploadURL(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/template.AvatarService/GetUploadURL",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AvatarServiceServer).GetUploadURL(ctx, req.(*UploadGetUrlRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _AvatarService_ConfirmUpload_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UploadConfirmRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AvatarServiceServer).ConfirmUpload(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/template.AvatarService/ConfirmUpload",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AvatarServiceServer).ConfirmUpload(ctx, req.(*UploadConfirmRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _AvatarService_TESTUploadImage_Handler(srv interface{}, stream grpc.ServerStream) error {
	return srv.(AvatarServiceServer).TESTUploadImage(&avatarServiceTESTUploadImageServer{stream})
}

type AvatarService_TESTUploadImageServer interface {
	SendAndClose(*TESTUploadImageResponse) error
	Recv() (*TESTUploadImageRequest, error)
	grpc.ServerStream
}

type avatarServiceTESTUploadImageServer struct {
	grpc.ServerStream
}

func (x *avatarServiceTESTUploadImageServer) SendAndClose(m *TESTUploadImageResponse) error {
	return x.ServerStream.SendMsg(m)
}

func (x *avatarServiceTESTUploadImageServer) Recv() (*TESTUploadImageRequest, error) {
	m := new(TESTUploadImageRequest)
	if err := x.ServerStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

func _AvatarService_Delete_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(emptypb.Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AvatarServiceServer).Delete(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/template.AvatarService/Delete",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AvatarServiceServer).Delete(ctx, req.(*emptypb.Empty))
	}
	return interceptor(ctx, in, info, handler)
}

func _AvatarService_GetAvatarView_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetAvatarViewRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AvatarServiceServer).GetAvatarView(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/template.AvatarService/GetAvatarView",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AvatarServiceServer).GetAvatarView(ctx, req.(*GetAvatarViewRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// AvatarService_ServiceDesc is the grpc.ServiceDesc for AvatarService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var AvatarService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "template.AvatarService",
	HandlerType: (*AvatarServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetUploadURL",
			Handler:    _AvatarService_GetUploadURL_Handler,
		},
		{
			MethodName: "ConfirmUpload",
			Handler:    _AvatarService_ConfirmUpload_Handler,
		},
		{
			MethodName: "Delete",
			Handler:    _AvatarService_Delete_Handler,
		},
		{
			MethodName: "GetAvatarView",
			Handler:    _AvatarService_GetAvatarView_Handler,
		},
	},
	Streams: []grpc.StreamDesc{
		{
			StreamName:    "TESTUploadImage",
			Handler:       _AvatarService_TESTUploadImage_Handler,
			ClientStreams: true,
		},
	},
	Metadata: "grpc-proto/avatar.proto",
}
