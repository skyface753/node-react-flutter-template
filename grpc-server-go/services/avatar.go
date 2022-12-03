package services

import (
	"context"
	"log"
	db "template/server/helper/db"
	pb "template/server/pb/template"
	dbPrisma "template/server/prisma/db"
)

type avatarServer struct {
	pb.UnimplementedAvatarServiceServer

	prismaClient *dbPrisma.PrismaClient
}

func NewAvatarServer(prismaClient *dbPrisma.PrismaClient) *avatarServer {
	return &avatarServer{
		prismaClient: prismaClient,
	}
}

func (s *avatarServer) GetAvatarView(ctx context.Context, in *pb.GetAvatarViewRequest) (*pb.GetAvatarViewResponse, error) {
	// Unimplemented
	return nil, nil
	rows, err := db.DB.Query("SELECT id, username FROM testuser.user")
	if err != nil {
		log.Printf("Error: %v", err)
	}
	defer rows.Close()
	var (
		id int
		username string
	)
	for rows.Next() {
		err := rows.Scan(&id, &username)
		if err != nil {
			log.Printf("Error: %v", err)
		}
		log.Printf("ID: %v", id)
		log.Printf("Username: %v", username)
	}
	err = rows.Err()
	if err != nil {
		log.Printf("Error: %v", err)
	}
	

	avatar, err := s.prismaClient.Avatar.FindMany(
		dbPrisma.Avatar.Userfk.Equals(int(in.UserId)),
	).Exec(context.Background())

	if err != nil {
		log.Fatalf("Error querying db")
		return nil, err
	}
	log.Printf("Avatar: %v", avatar)

	// Create a test avatar
	// a, err := prismaClient.Avatar.CreateOne(
	// 	dbPrisma.Avatar.Userfk.Set(int(in.UserId)),
	// ).Exec(context.Background())
	if err != nil {
		log.Fatalf("Error creating avatar")
		return nil, err
	}

	return &pb.GetAvatarViewResponse{
		Url: "url",
	}, nil
}


