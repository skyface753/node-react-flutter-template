package main

import (
	"log"
	"net"
	db "template/server/helper/db"
	pb "template/server/pb/template"

	services "template/server/services"

	"template/server/helper/redis"

	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	// s3Client "template/server/helper/s3"
	awsS3Client "template/server/helper/s3aws"
)

//	func (s *server) GetBookList(ctx context.Context, in *pb.GetBookListRequest) (*pb.GetBookListResponse, error) {
//		log.Printf("Received request: %v", in.ProtoReflect().Descriptor().FullName())
//		return &pb.GetBookListResponse{
//			Books: getSampleBooks(),
//		}, nil
//	}
const (
	port = ":50051"
)

func main() {
	godotenv.Load()

	listener, err := net.Listen("tcp", port)
	if err != nil {
		panic(err)
	}
	log.Printf("Server listening on port %v", port)
	
	// resS3 := awsS3Client.Test()
	// log.Printf("S3: %v", resS3)
	db.InitDB()
	redis.InitRedis()
	defer db.CloseDB()

	// s3Client.NewClient()
	awsS3Client.NewClient()
	// log.Printf("S3: %v", awsS3Client.Test())
	// url, error := awsS3Client.GetPresignedURL("TWESTFOFIKDFK")
	// if error != nil {
	// 	log.Printf("Error: %v", error)
	// }
	// log.Printf("URL: %v", url)

	

	s := grpc.NewServer()
	reflection.Register(s)
	pb.RegisterAuthServiceServer(s, &services.AuthServer{})
	pb.RegisterAvatarServiceServer(s, &services.AvatarServer{})
	if err := s.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}


