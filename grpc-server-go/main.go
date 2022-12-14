package main

import (
	"log"
	"net"
	pb "template/server/grpc-proto"
	db "template/server/helper/db"
	"template/server/helper/envget"

	services "template/server/services"

	"template/server/helper/redis"

	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	"template/server/helper/s3"
)

var (
	port = ":50051"
)

func main() {
	godotenv.Load()

	prod := envget.GetEnv("PROD", "FALSE")
	if prod == "TRUE" {
		log.Printf("PROD")
	}else{
		port = "localhost" + port
	}

	listener, err := net.Listen("tcp", port)
	if err != nil {
		panic(err)
	}
	log.Printf("Server listening on port %v", port)
	
	db.InitDB()
	redis.InitRedis()
	defer db.CloseDB()
	s3.NewClient()

	

	s := grpc.NewServer()
	reflection.Register(s)
	pb.RegisterAuthServiceServer(s, &services.AuthServer{})
	pb.RegisterAvatarServiceServer(s, &services.AvatarServer{})
	if err := s.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}


