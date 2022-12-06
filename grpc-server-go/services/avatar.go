package services

import (
	"context"
	"database/sql"
	"log"
	"strconv"
	db "template/server/helper/db"
	s3Client "template/server/helper/s3"
	pb "template/server/pb/template"

	"github.com/golang/protobuf/ptypes/empty"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type AvatarServer struct {
	pb.UnimplementedAvatarServiceServer
}






func (s *AvatarServer) RequestAUploadURL(ctx context.Context, in *pb.UploadUrlRequest) (*pb.UploadUrlResponse, error) {
	var ( //Incoming
		orgName string = in.Filename
	)
	id, _, _, err := verifyInMetadataAuthToken(ctx)
	if err != nil {
		return nil, err
	}
	idString := strconv.Itoa(*id)
	res, key, err := s3Client.SignedPutURL(idString + "-" + orgName)

	if err != nil {
		log.Printf("Error: %v", err)
		return nil, err
	}
	log.Printf("Signed URL: %v", res)
	// Save to DB (userfk, originalname, generatedpath, type)
	sqlInsert, err := db.DB.Query("INSERT INTO testuser.avatar (userfk, originalname, generatedpath, type) VALUES ($1, $2, $3, $4) ON CONFLICT (userfk) DO UPDATE SET originalname = $2, generatedpath = $3, type = $4", id, orgName, key, "image")
	if err != nil {
		log.Printf("Error: %v", err)
		return nil, err
	}
	defer sqlInsert.Close()

			return &pb.UploadUrlResponse{
		Url: res.String(),
	}, nil
}

func (s *AvatarServer) Delete (ctx context.Context, in *empty.Empty) (*empty.Empty, error) {
	id, _, _, err := verifyInMetadataAuthToken(ctx)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "Invalid token")
	}
	sqlDelete, err := db.DB.Query("DELETE FROM testuser.avatar WHERE userfk = $1", *id)
	log.Printf("Deleted avatar for user %v", *id)
	if err != nil {
		log.Printf("Error: %v", err)
		return nil, status.Error(codes.NotFound, "Avatar not found")
	}
	defer sqlDelete.Close()
	return &empty.Empty{}, nil

}

func (s *AvatarServer) GetAvatarView(ctx context.Context, in *pb.GetAvatarViewRequest) (*pb.GetAvatarViewResponse, error) {
	var ( //Incoming
		id int32 = in.UserId
	)
	// Get from DB (userfk, originalname, generatedpath, type)
	var (
		originalName sql.NullString
		generatedPath sql.NullString
		avatarType sql.NullString
	)
	
	err := db.DB.QueryRow("SELECT originalname, generatedpath, type FROM testuser.avatar WHERE userfk = $1", id).Scan(&originalName, &generatedPath, &avatarType)
	if err != nil {
		log.Printf("Error: %v, %v", err, id)
		return nil, status.Error(codes.NotFound, "Avatar not found")
	}
	if !originalName.Valid || !generatedPath.Valid || !avatarType.Valid {
		return nil, status.Error(codes.NotFound, "Avatar not found")
	}
	
	
	s3Url, err := s3Client.SignedGetURL(generatedPath.String)
	if err != nil {
		log.Printf("Error: %v", err)
		return nil, err
	}

	return &pb.GetAvatarViewResponse{
	Url: s3Url.String(),
	}, nil
}