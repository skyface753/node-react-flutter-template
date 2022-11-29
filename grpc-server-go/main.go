package main

import (
	"context"
	"log"
	"net"
	pb "template/server/pb/template"

	dbPrisma "template/server/prisma/db"
	dbPlain "template/server/services"

	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)
type authServer struct {
	pb.UnimplementedAuthServiceServer
}
type avatarServer struct {
	pb.UnimplementedAvatarServiceServer
	
}

var prismaClient *dbPrisma.PrismaClient;


func (s *authServer) Login(ctx context.Context, in *pb.LoginRequest) (*pb.DefaultAuthResponse, error) {
	log.Printf("Received: %v", in)
	var ( usernameIn string = in.Username
		passwordIn string = in.Password
	)
	_ = passwordIn
	dbplain1, err := dbPlain.NewDB()
	if err != nil {log.Fatalf("Error connecting to db"); return nil, err}
	users, err := dbplain1.Query("SELECT id, username, password, rolefk FROM testuser.user WHERE username = $1)", usernameIn)
	if err != nil {
		log.Fatalf("Error querying db")
		
	}
	defer users.Close()
	var id int
	var username string
	var password string
	var role int
	for users.Next() {
		err := users.Scan(&id, &username, &password, &role)
		if err != nil {
			log.Println("Error scanning db")
			return nil, err
		}
	}
	log.Printf("User: %v", username)

	return &pb.DefaultAuthResponse{
		AccessToken: "token",
	}, nil
}



func (s *avatarServer) GetAvatarView(ctx context.Context, in *pb.GetAvatarViewRequest) (*pb.GetAvatarViewResponse, error) {
	
	
	
	avatar, err := prismaClient.Avatar.FindMany(
		dbPrisma.Avatar.Userfk.Equals(int(in.UserId)),
	).Exec(context.Background())

	if err != nil {		log.Fatalf("Error querying db");		return nil, err	}
	log.Printf("Avatar: %v", avatar)

	// Create a test avatar
	a, err := prismaClient.Avatar.CreateOne(
		dbPrisma.Avatar.Userfk.Set(int(in.UserId)),
	).Exec(context.Background())
	if err != nil {		log.Fatalf("Error creating avatar");		return nil, err	}
	


	return &pb.GetAvatarViewResponse{
		Url: "url",
	}, nil
}

// func (s *server) GetBookList(ctx context.Context, in *pb.GetBookListRequest) (*pb.GetBookListResponse, error) {
// 	log.Printf("Received request: %v", in.ProtoReflect().Descriptor().FullName())
// 	return &pb.GetBookListResponse{
// 		Books: getSampleBooks(),
// 	}, nil
// }
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
	pb.RegisterAuthServiceServer(s, &authServer{})
	pb.RegisterAvatarServiceServer(s, &avatarServer{})
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