package services_test

import (
	"bytes"
	"context"
	"errors"
	"log"
	"net"
	"net/http"
	pb "template/server/grpc-proto"
	db "template/server/helper/db"
	"template/server/helper/redis"
	"template/server/helper/s3"
	"template/server/services"
	"testing"

	"github.com/golang/protobuf/ptypes/empty"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"google.golang.org/grpc/test/bufconn"
)


func authServerMock(ctx context.Context) (pb.AuthServiceClient, func()) {
	buffer := 101024 * 1024
	lis := bufconn.Listen(buffer)

	baseServer := grpc.NewServer()
	pb.RegisterAuthServiceServer(baseServer, &services.AuthServer{})
	go func() {
		if err := baseServer.Serve(lis); err != nil {
			log.Printf("error serving server: %v", err)
		}
	}()

	// INIT
	db.InitDB()
	redis.InitRedis()
	s3.NewClient()

	conn, err := grpc.DialContext(ctx, "",
		grpc.WithContextDialer(func(context.Context, string) (net.Conn, error) {
			return lis.Dial()
		}), grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Printf("error connecting to server: %v", err)
	}

	closer := func() {
		err := lis.Close()
		if err != nil {
			log.Printf("error closing listener: %v", err)
		}
		baseServer.Stop()
	}

	client := pb.NewAuthServiceClient(conn)

	return client, closer
}


func avatarServer(ctx context.Context) (pb.AvatarServiceClient, func()) {
	buffer := 101024 * 1024
	lis := bufconn.Listen(buffer)

	baseServer := grpc.NewServer()
	pb.RegisterAvatarServiceServer(baseServer, &services.AvatarServer{})
	go func() {
		if err := baseServer.Serve(lis); err != nil {
			log.Printf("error serving server: %v", err)
		}
	}()

	// INIT
	db.InitDB()
	redis.InitRedis()
	s3.NewClient()

	conn, err := grpc.DialContext(ctx, "",
		grpc.WithContextDialer(func(context.Context, string) (net.Conn, error) {
			return lis.Dial()
		}), grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Printf("error connecting to server: %v", err)
	}

	closer := func() {
		err := lis.Close()
		if err != nil {
			log.Printf("error closing listener: %v", err)
		}
		baseServer.Stop()
	}

	client := pb.NewAvatarServiceClient(conn)

	return client, closer
}

func TestAvatarServer(t *testing.T){
	if testing.Short() {
        t.Skip("skipping integration test")
    }
	ctx := context.Background()

	client, closer := avatarServer(ctx)
	defer closer()

	// Clear user_2fa
	db.DB.Query("DELETE FROM user_2fa")

	getUploadurl(t, ctx, client)
}

func getUploadurl(t *testing.T, ctx context.Context, client pb.AvatarServiceClient) {
	t.Run("getUploadurl/Fail/EmptyFilename", func(t *testing.T) {
		_, err := client.GetUploadURL(ctx, &pb.UploadGetUrlRequest{
			Filename: "",
		})
		if err.Error()  != errors.New("rpc error: code = InvalidArgument desc = Invalid filename").Error(){
			t.Errorf("Expected error, got %v", err)
		}
	},)
	t.Run("getUploadurl/Fail/NotLoggedIn", func(t *testing.T) {
		_, err := client.GetUploadURL(ctx, &pb.UploadGetUrlRequest{
			Filename: "test.jpg",
		})
		if err.Error()  != status.Error(codes.Unauthenticated, "Invalid token").Error(){
			t.Errorf("Expected error, got %v", err)
		}
	})
	t.Run("getUploadurl/Success", func(t *testing.T) {
		// Login
		authClient, closer :=  authServerMock(ctx)
		defer closer()
		loginResponse, err := authClient.Login(ctx, &pb.LoginRequest{
			Username: "admin",
			Password: "Admin123",
		})
		if err != nil {
			t.Errorf("Expected nil, got %v", err)
		}
		if loginResponse.AccessToken == "" {
			t.Errorf("Expected token, got empty string")
		}
		metadataForUpload := metadata.New(map[string]string{"authorization": loginResponse.AccessToken})
		ctxOut := metadata.NewOutgoingContext(ctx, metadataForUpload)

		// Get upload url
		uploadResponse, err := client.GetUploadURL(ctxOut, &pb.UploadGetUrlRequest{
			Filename: "test.jpg",
		})
		if err != nil {
			t.Errorf("Expected nil, got %v", err)
		}
		if uploadResponse.Url == "" {
			t.Errorf("Expected upload url, got empty string")
		}

		// Upload to s3 (PUT)
		uploadRequest, err := http.NewRequest("PUT", uploadResponse.Url, bytes.NewReader([]byte("test")))
		if err != nil {
			t.Errorf("Expected nil, got %v", err)
		}
		uploadRequest.Header.Set("Content-Type", "image/jpeg")
		uploadToS3Response, err := http.DefaultClient.Do(uploadRequest)
		if err != nil {
			t.Errorf("Expected nil, got %v", err)
		}
		if uploadToS3Response.StatusCode != 200 {
			t.Errorf("Expected 200, got %v", uploadToS3Response.StatusCode)
		}

		// Send upload confirm
		_, err = client.ConfirmUpload(ctx, &pb.UploadConfirmRequest{
			Token: uploadResponse.TokenToConfirm,
		})
		//Should fail because of missing auth token
		if err.Error() != status.Error(codes.Unauthenticated, "Invalid token").Error(){
			t.Errorf("Expected error, got %v", err)
		}
		
		// Success
		uploadCompleteResponse, err := client.ConfirmUpload(ctxOut, &pb.UploadConfirmRequest{
			Token: uploadResponse.TokenToConfirm,
		})
		if err != nil {
			t.Errorf("Expected nil, got %v", err)
		}
		if uploadCompleteResponse.Url == "" {
			t.Errorf("Expected upload url, got empty string")
		}

		// Get avatar (GET)
		getAvatarRequest, err := http.NewRequest("GET", uploadCompleteResponse.Url, nil)
		if err != nil {
			t.Errorf("Expected nil, got %v", err)
		}
		getAvatarResponse, err := http.DefaultClient.Do(getAvatarRequest)
		if err != nil {
			t.Errorf("Expected nil, got %v", err)
		}
		if getAvatarResponse.StatusCode != 200 {
			t.Errorf("Expected 200, got %v", getAvatarResponse.StatusCode)
		}

		// Get Avatar from grpc
		avatarResponse, err := client.GetAvatarView(ctxOut, &pb.GetAvatarViewRequest{
			UserId: loginResponse.User.Id,
		})
		if err != nil {
			t.Errorf("Expected nil, got %v", err)
		}
		if avatarResponse.Url == "" {
			t.Errorf("Expected avatar url, got empty string")
		}

		// Delete avatar - Fail
		_, err = client.Delete(ctx, &empty.Empty{

		})
		if err.Error() != status.Error(codes.Unauthenticated, "Invalid token").Error(){
			t.Errorf("Expected error, got %v", err)
		}

		// Delete avatar - Success
		_, err = client.Delete(ctxOut, &empty.Empty{
		})
		if err != nil {
			t.Errorf("Expected nil, got %v", err)
		}

		
		


	})

}