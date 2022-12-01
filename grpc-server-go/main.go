package main

import (
	"log"
	"net"
	db "template/server/helper/db"
	pb "template/server/pb/template"

	dbPrisma "template/server/prisma/db"
	services "template/server/services"

	"template/server/helper/redis"

	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

var prismaClient *dbPrisma.PrismaClient

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

	prismaClient = dbPrisma.NewClient()
	if err := prismaClient.Prisma.Connect(); err != nil {
		log.Fatalf("Error connecting to db")
		return
	}
	defer func() {
		if err := prismaClient.Prisma.Disconnect(); err != nil {
			panic(err)
		}
	}()

	s := grpc.NewServer()
	reflection.Register(s)
	pb.RegisterAuthServiceServer(s, services.NewAuthServer(prismaClient))
	pb.RegisterAvatarServiceServer(s, services.NewAvatarServer(prismaClient))
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
