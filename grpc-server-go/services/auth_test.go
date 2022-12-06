package services_test

import (
	"context"
	pb "template/server/pb/template"
	services "template/server/services"
	"testing"
)

func TestAuth(t *testing.T) {
	authServer := services.AuthServer{}
	resp, err := authServer.Login(context.Background(), &pb.LoginRequest{
		Username: "user",
		Password: "pass",
	})
	
	if err != nil {
		t.Fatal(err)
	}
	t.Log(resp)
}

