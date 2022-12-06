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

	s3Client "template/server/helper/s3"
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

	listener, err := net.Listen("tcp", "localhost"+port)
	if err != nil {
		panic(err)
	}
	log.Printf("Server listening on port %v", port)
	db.InitDB()
	redis.InitRedis()
	defer db.CloseDB()

	s3Client.NewClient()

	

	s := grpc.NewServer()
	reflection.Register(s)
	pb.RegisterAuthServiceServer(s, &services.AuthServer{})
	pb.RegisterAvatarServiceServer(s, &services.AvatarServer{})
	if err := s.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

// func getSampleBooks() []*pb.Book {
// 	sampleBooks := []*pb.Book{
// 		{
// 			Title:     "The Hitchhiker's Guide to the Galaxy",
// 			Author:    "Douglas Adams",
// 			PageCount: 42,
// 		},
// 		{
// 			Title:     "The Lord of the Rings",
// 			Author:    "J.R.R. Tolkien",
// 			PageCount: 1234,
// 		},
// 	}
// 	return sampleBooks
// }
