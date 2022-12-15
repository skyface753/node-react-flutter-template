package services

import (
	"context"
	"database/sql"
	"log"
	"os"
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
// rpc UploadImage(stream UploadImageRequest) returns (UploadImageResponse);
// func (s *AvatarServer) UploadImage(stream pb.AvatarService_UploadImageServer) error {
// 	// Get user id from token
// 	id, _, _, err := verifyInMetadataAuthToken(stream.Context())
// 	if err != nil {
// 		return status.Error(codes.Unauthenticated, "Invalid token")
// 	}
// 	idString := strconv.Itoa(*id)
// 	randString := generators.GetRandomString(8)
// 	// Get file extension
// 	var fileExtension string
// 	var filename string
// 	var imageType string
// 	for {
// 		in, err := stream.Recv()
// 		if err == io.EOF {

// 			// We have finished reading the client stream
// 			if(fileExtension == ""){
// 				//TODO: Delete file from S3
// 				return status.Error(codes.InvalidArgument, "No file extension")
// 			}
// 			// Write to db
// 			sqlInsert, err := db.DB.Query("INSERT INTO testuser.avatar (userfk, originalname, generatedpath, type) VALUES ($1, $2, $3, $4) ON CONFLICT (userfk) DO UPDATE SET originalname = $2, generatedpath = $3, type = $4", id, filename, idString + "-" + randString + "." + fileExtension, imageType)
// 			if err != nil {
// 				log.Printf("Error: %v", err)
// 				return status.Error(codes.Internal, "Error writing to DB")
// 			}
// 			defer sqlInsert.Close()

// 			// Close file
			

// 			// Return response
// 			log.Printf("File uploaded")
// 			return stream.SendAndClose(&pb.UploadImageResponse{
// 				GeneratedPath: idString + "-" + randString + "." + fileExtension,
// 			})
// 		}
// 		if err != nil {
// 			return status.Error(codes.Internal, "Error receiving file")
// 		}
// 		log.Printf("Received: %v", in.GetInfo())
// 		if in.GetChunkData() != nil {
// 			if(fileExtension == ""){
// 				if(in.GetInfo() == nil){
// 					return status.Error(codes.InvalidArgument, "No file extension")
// 				}
				
// 				if(in.GetInfo().Filename == "" || in.GetInfo().Filename == " "){
// 					return status.Error(codes.InvalidArgument, "No file extension")
// 				}

// 				fileExtension = strings.Split(in.GetInfo().GetFilename(), ".")[1]
// 			}
			
// 			// Write chunk to file
// 			err = os.WriteFile("temp/" + idString + "-" + randString + "." + fileExtension, in.GetChunkData(), 0644)
// 			if err != nil {
// 				log.Printf("Error: %v", err)
// 				return status.Error(codes.Internal, "Error writing file")
// 			}
// 		}
// 		if in.GetInfo() != nil {
// 			if(in.GetInfo().GetFilename() != ""){
// 				filename = in.GetInfo().GetFilename()
// 				fileExtension = strings.Split(filename, ".")[1]
// 			}
// 			if(in.GetInfo().GetType() != ""){
// 				imageType = in.GetInfo().GetType()
// 			}
// 			log.Printf("File extension: %v", fileExtension)

// 		}
		
// 	}

// }

//writeToFp takes in a file pointer and byte array and writes the byte array into the file
//returns error if pointer is nil or error in writing to file
func writeToFp(fp *os.File, data []byte) error {
	w := 0
	n := len(data)
	for {

		nw, err := fp.Write(data[w:])
		if err != nil {
			return err
		}
		w += nw
		if nw >= n {
			return nil
		}
	}

}

//TEST

// func (s *AvatarServer) UploadImage(stream pb.AvatarService_UploadImageServer) error {
// 	// userId, _, _, err := verifyInMetadataAuthToken(stream.Context())
// 		// if err != nil {
// 		// 	return status.Error(codes.Unauthenticated, "Invalid token")
// 		// }
// firstChunk := true
// 	var fp *os.File

// 	var fileData *pb.UploadImageRequest

// 	const destDir = "temp"

// 	var orgFilename string
// 	var genFilename string
// 	var imageType string
// 	var err error
// 	// Pointer int 1
// 	var testId = 1
// 	userId := &testId
// 	log.Printf("FileData: %v", fileData)
// 	for {

// 		fileData, err = stream.Recv() //ignoring the data  TO-Do save files received

// 		if err != nil {
// 			if err == io.EOF {
// 				break
// 			}
			
// 			return status.Error(codes.Internal, err.Error())
// 		}

// 		if firstChunk { //first chunk contains file name

// 			if fileData.GetInfo().Filename != "" { //create file
// 				orgFilename = fileData.GetInfo().Filename
// 				genFilename = fmt.Sprintf("%d-%s.%s", *userId, generators.GetRandomString(10), strings.Split(fileData.GetInfo().Filename, ".")[1])
// 				log.Printf("User %d is uploading file %s", *userId, genFilename)
// 				imageType = fileData.GetInfo().GetType()
// 				// fp, err = os.Create(path.Join(s.destDir, filepath.Base(fileData.GetInfo().Filename)))
// 				fp, err = os.Create(path.Join(destDir, genFilename)) // TODO: CHECK
// 				if err != nil {
// 					// s.logger.Error().Msg("Unable to create file  :" + fileData.Filename)
// 					log.Printf("Unable to create file  :" + genFilename)
// 					return status.Error(codes.Internal, err.Error())
// 				}
// 				defer fp.Close()
// 			} else {
// 				// s.logger.Error().Msg("FileName not provided in first chunk  :" + fileData.Filename)
// 				log.Printf("FileName not provided in first chunk  :" + fileData.GetInfo().Filename)
// 				return status.Error(codes.InvalidArgument, "FileName not provided in first chunk")

// 			}
// 			// filename = fileData.GetInfo().Filename
// 			firstChunk = false
// 		}

// 		err = writeToFp(fp, fileData.GetChunkData())
// 		if err != nil {
// 			log.Printf("Unable to write chunk of filename :" + genFilename + " " + err.Error())
// 			return status.Error(codes.Internal, err.Error())

// 			// s.logger.Error().Msg("Unable to write chunk of filename :" + fileData.Filename + " " + err.Error())
// 			// stream.SendAndClose(&proto.UploadResponseType{
// 			// 	Message: "Unable to write chunk of filename :" + fileData.Filename,
// 			// 	Code:    proto.UploadStatusCode_Failed,
// 			// })
// 			// return
// 		}
// 	}

// 	//s.logger.Info().Msg("upload received")
// 	// err = stream.SendAndClose(&proto.UploadResponseType{
// 	// 	Message: "Upload received with success",
// 	// 	Code:    proto.UploadStatusCode_Ok,
// 	// })
// 	// TODO: save file to database
// 			sqlInsert, err := db.DB.Query("INSERT INTO testuser.avatar (userfk, originalname, generatedpath, type) VALUES ($1, $2, $3, $4) ON CONFLICT (userfk) DO UPDATE SET originalname = $2, generatedpath = $3, type = $4", *userId, orgFilename, genFilename, imageType)
// 			if err != nil {
// 				log.Printf("Unable to save file to database :" + err.Error())
// 				return status.Error(codes.Internal, err.Error())
// 			}
// 			defer sqlInsert.Close()

// 			err = stream.SendAndClose(&pb.UploadImageResponse{
// 		GeneratedPath: genFilename,
// 	})

// 	if err != nil {
// 		// s.logger.Error().Msg("Unable to send response to client :" + err.Error())
// 		log.Printf("Unable to send response to client :" + err.Error())
// 		return status.Error(codes.Internal, err.Error())	
// 	}
// 	fmt.Println("Successfully received and stored the file :" + genFilename + " in " + destDir)
// 	return nil
// }