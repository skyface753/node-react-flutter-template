package services_test

import (
	"context"
	"log"
	"net"
	"testing"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/test/bufconn"

	pb "template/server/grpc-proto"
	db "template/server/helper/db"
	"template/server/helper/redis"
	"template/server/helper/s3"
	"template/server/services"
)

const bufSize = 1024 * 1024

var lis *bufconn.Listener

func init(){
	log.Println("init")

	lis = bufconn.Listen(bufSize)
	s := grpc.NewServer()
	db.InitDB()
	
	redis.InitRedis()
	// defer db.CloseDB()
	s3.NewClient()
	

	pb.RegisterAuthServiceServer(s, &services.AuthServer{})
	go func() {
		if err := s.Serve(lis); err != nil {
			panic(err)
		}
	}()
    
}

func bufDialer(context.Context, string) (net.Conn, error) {
	return lis.Dial()
}

func TestAuth(t *testing.T) {


	ctx := context.Background()
    conn, err := grpc.DialContext(ctx, "bufnet", grpc.WithContextDialer(bufDialer), grpc.WithTransportCredentials(insecure.NewCredentials()))
    if err != nil {
        t.Fatalf("Failed to dial bufnet: %v", err)
    }
    defer conn.Close()
    client := pb.NewAuthServiceClient(conn)
    resp, err := client.Login(ctx, &pb.LoginRequest{
		Username: "admin",
		Password: "Admin123",
	})
    if err != nil {
        t.Fatalf("Login failed: %v", err)
    }
    
	// Check the response
	if resp.GetAccessToken() == "" {
		t.Fatalf("Token is empty")
	}
	

}



