package services

import (
	"context"
	"log"
	pb "template/server/pb/template"
	dbPrisma "template/server/prisma/db"
)

type authServer struct {
	pb.UnimplementedAuthServiceServer
	prismaClient *dbPrisma.PrismaClient
}

func NewAuthServer(prismaClient *dbPrisma.PrismaClient) *authServer {
	return &authServer{
		prismaClient: prismaClient,
	}
}

func (s *authServer) Login(ctx context.Context, in *pb.LoginRequest) (*pb.DefaultAuthResponse, error) {
	log.Printf("Received: %v", in)
	var (
		usernameIn string = in.Username
		passwordIn string = in.Password
	)
	_ = passwordIn
	_ = usernameIn
	return &pb.DefaultAuthResponse{
		AccessToken: "token1",
	}, nil
}
