package services

import (
	"context"
	"database/sql"
	"log"
	"strconv"
	"strings"
	db "template/server/helper/db"
	"template/server/helper/generators"

	pb "template/server/grpc-proto"

	"template/server/helper/s3"

	"github.com/golang/protobuf/ptypes/empty"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type AvatarServer struct {
	pb.UnimplementedAvatarServiceServer
}






func (s *AvatarServer) GetUploadURL(ctx context.Context, in *pb.UploadGetUrlRequest) (*pb.UploadGetUrlResponse, error){
	var ( //Incoming
		filename = in.Filename
	)
	if(filename == ""){
		return nil, status.Error(codes.InvalidArgument, "Invalid filename")
	}
	id, _, _, err := verifyInMetadataAuthToken(ctx)
	if err != nil {
		log.Printf("Error: %v", err)
		return nil, status.Error(codes.Unauthenticated, "Invalid token")
	}
	idString := strconv.Itoa(*id)
	fileExtensionArray := strings.Split(filename, ".")
	if len(fileExtensionArray) < 2 {
		return nil, status.Error(codes.InvalidArgument, "Invalid file type")
	}
	fileExtension := fileExtensionArray[len(fileExtensionArray)-1]
	fileTypeFromExtension := "image"
	if fileExtension != "png" && fileExtension != "jpg" && fileExtension != "jpeg" {
		return nil, status.Error(codes.InvalidArgument, "Invalid file type")
	}
	fileTypeFromExtension = fileTypeFromExtension + "/" + fileExtension
	randString := generators.GetRandomString(8)
	newFileName := idString + "-" + randString + "." + fileExtension
	url, fullKey, err := s3.PresignedPut(newFileName)
	if err != nil {
		log.Printf("Error: %v", err)
		return nil, status.Error(codes.Internal, "Error generating signed URL")
	}
	jwt, err := generators.GenerateJwtForS3Upload(*fullKey, filename, fileTypeFromExtension)
	if err != nil {
		log.Printf("Error: %v", err)
		return nil, status.Error(codes.Internal, "Error generating JWT")
	}
	return &pb.UploadGetUrlResponse{
		Url: *url,
		TokenToConfirm: jwt,
	}, nil

}

func (s *AvatarServer) ConfirmUpload(ctx context.Context, in *pb.UploadConfirmRequest) (*pb.UploadConfirmResponse, error){
	var ( //Incoming
		token = in.Token
	)
	id, _, _, err := verifyInMetadataAuthToken(ctx)
	if err != nil {
		log.Printf("Error: %v", err)
		return nil, status.Error(codes.Unauthenticated, "Invalid token")
	}
	// Verify JWT
	filename, originalName, fileType, err := generators.VerifyJwtForS3Upload(token)
	if err != nil {
		log.Printf("Error: %v", err)
		return nil, status.Error(codes.Unauthenticated, "Invalid Confirm token")
	}
	// Check if file exists
	exists, errE := s3.Exists(filename)
	if errE != nil {
		log.Printf("Error: %v", err)
		return nil, status.Error(codes.Internal, "Error checking if file exists")
	}
	if !exists {
		return nil, status.Error(codes.NotFound, "File not found")	
	}
	sqlInsert, err := db.DB.Query("INSERT INTO testuser.avatar (userfk, originalname, generatedpath, type) VALUES ($1, $2, $3, $4) ON CONFLICT (userfk) DO UPDATE SET originalname = $2, generatedpath = $3, type = $4", id, originalName, filename, fileType)
	if err != nil {
		log.Printf("Error: %v", err)
		return nil, status.Error(codes.Internal, "Error inserting into DB")
	}
	defer sqlInsert.Close()

	// Get presigned URL for avatar
	url, err := s3.PresignedGet(filename)
	if err != nil {
		log.Printf("Error: %v", err)
		return nil, status.Error(codes.Internal, "Error generating signed URL")
	}


	return &pb.UploadConfirmResponse{
		Url: url.URL,
	}, nil
}

// func (s *AvatarServer) RequestAUploadURL(ctx context.Context, in *pb.UploadUrlRequest) (*pb.UploadUrlResponse, error) {
// 	var ( //Incoming
// 		orgName string = in.Filename
// 	)
// 	id, _, _, err := verifyInMetadataAuthToken(ctx)
// 	if err != nil {
// 		log.Printf("Error: %v", err)
// 		return nil, status.Error(codes.Unauthenticated, "Invalid token")
// 	}
// 	idString := strconv.Itoa(*id)
// 	randString := generators.GetRandomString(8)
// 	fileExtensionArray := strings.Split(orgName, ".")
// 	if len(fileExtensionArray) < 2 {
// 		return nil, status.Error(codes.InvalidArgument, "Invalid file type")
// 	}
// 	fileExtension := fileExtensionArray[len(fileExtensionArray)-1]
// 	if fileExtension != "png" && fileExtension != "jpg" && fileExtension != "jpeg" {
// 		return nil, status.Error(codes.InvalidArgument, "Invalid file type")
// 	}
// 	res, key, err := s3.PresignedPut(idString + "-" + randString + "." + fileExtension)
// 	// res2, key2, err2 := s3Client.
// 	// res, key, err := s3Client.SignedPutURL(idString + "-" + orgName)

// 	if err != nil {
// 		log.Printf("Error: %v", err)
// 		return nil, status.Error(codes.Internal, "Error generating signed URL")
// 	}
// 	// log.Printf("Signed URL: %v", res)
// 	// Save to DB (userfk, originalname, generatedpath, type)
// 	sqlInsert, err := db.DB.Query("INSERT INTO testuser.avatar (userfk, originalname, generatedpath, type) VALUES ($1, $2, $3, $4) ON CONFLICT (userfk) DO UPDATE SET originalname = $2, generatedpath = $3, type = $4", id, orgName, key, "image")
// 	if err != nil {
// 		log.Printf("Error: %v", err)
// 		return nil, status.Error(codes.Internal, "Error 0x0001")
// 	}
// 	defer sqlInsert.Close()

// 			return &pb.UploadUrlResponse{
// 		Url: *res,
// 	}, nil
// }

// func(s *AvatarServer) ConfirmUpload (ctx context.Context, in *pb.ConfirmUploadRequest) (*pb.ConfirmUploadResponse, error){
// 	id, _, _, err := verifyInMetadataAuthToken(ctx)
// 	if err != nil {
// 		return nil, status.Error(codes.Unauthenticated, "Invalid token")
// 	}
// 	// Request is empty
// 	// Get avatar from DB
// 	var (
// 		originalName string
// 		generatedPath string
// 		typeForAvatar string
// 	)
// 	err = db.DB.QueryRow("SELECT originalname, generatedpath, type FROM testuser.avatar WHERE userfk = $1", *id).Scan(&originalName, &generatedPath, &typeForAvatar)
// 	if err != nil {
// 		log.Printf("Error: %v", err)
// 		return nil, status.Error(codes.NotFound, "Avatar not found")
// 	}
// 	signedUrl, err := s3.PresignedGet(generatedPath)
// 	if err != nil {
// 		log.Printf("Error: %v", err)
// 		return nil, status.Error(codes.Internal, "Error generating signed URL")
// 	}

// 	return &pb.ConfirmUploadResponse{
// 		Url: signedUrl.URL,
		
// 	}, nil

// }

func (s *AvatarServer) Delete (ctx context.Context, in *empty.Empty) (*empty.Empty, error) {
	id, _, _, err := verifyInMetadataAuthToken(ctx)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "Invalid token")
	}
	// TODO: Delete avatar from S3
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
		log.Printf("Error: %v, %v", err, id)
		return nil, status.Error(codes.NotFound, "Avatar not found")
	}
	
	s3Url, err := s3.PresignedGet(generatedPath.String)
	// s3Url, err := s3Client.SignedGetURL(generatedPath.String)
	if err != nil {
		log.Printf("Error: %v", err)
		return nil, status.Error(codes.Internal, "Error generating signed URL")
	}

	return &pb.GetAvatarViewResponse{
	Url: s3Url.URL,
	}, nil
}