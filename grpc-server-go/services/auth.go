package services

import (
	"context"
	"database/sql"
	"log"
	"strconv"

	"strings"
	db "template/server/helper/db"
	"template/server/helper/generators"
	"template/server/helper/redis"
	"template/server/helper/s3"

	// s3Client "template/server/helper/s3"
	pb "template/server/grpc-proto"
	"template/server/helper/validator"

	"github.com/pquerna/otp/totp"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

type AuthServer struct {
	pb.UnimplementedAuthServiceServer
} 



func (s *AuthServer) Login(ctx context.Context, in *pb.LoginRequest) (*pb.DefaultAuthResponse, error) {
	

	////log.Printf("Received: %v", in)

	var ( // Incoming 
		usernameIn string = in.Username
		passwordIn string = in.Password
		totpIn *string = in.TotpCode
		
	)
	var ( // From the db
		id int
		// username string
		password string
		// rolefk int
		secretbase32 *string
		verified *bool
		// avatarPath *string
	)

	
	err := db.DB.QueryRow("SELECT id, password, secretbase32, verified FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user.id = testuser.user_2fa.userfk LEFT JOIN testuser.avatar ON testuser.avatar.userfk = testuser.user.id WHERE LOWER(username) = LOWER($1)", usernameIn).Scan(&id, &password, &secretbase32, &verified)
	if err != nil {
		return nil, status.Error(codes.NotFound, "User not found")
	}
	
	// _ = totpIn
	// Compare the stored hashed password, with the hashed version of the password that was received
	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(passwordIn))
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "Wrong password")
	}
	if(verified != nil && *verified) {
		if(totpIn == nil){
			return nil, status.Error(codes.Unauthenticated, "TOTP code required")
		}
		if (*totpIn == ""){
			return nil, status.Error(codes.Unauthenticated, "TOTP code required")
		}
		// Verify the TOTP code
		valid := totp.Validate(*totpIn, *secretbase32)
		
		if(!valid){
			return nil, status.Error(codes.Unauthenticated, "TOTP code invalid")
		}
		

	}
	// accessToken, errJwt := generators.GenerateJwt(id)
	// refreshToken := generators.GetARefreshToken(id)
	// if errJwt != nil {
	// 	return nil, errJwt
	// }
	
	defaultAuthResponse, err := createDefaultAuthResponse(id)
	if err != nil {
		return nil, err
	}	
	return defaultAuthResponse, nil
}

/*
Creates the access token and refresh token for the user
Gets the user data (id, username, role, generatedPath?) from the db
*/
func createDefaultAuthResponse(id int) (*pb.DefaultAuthResponse, error) {
	accessToken, errJwt := generators.GenerateJwt(id)
	refreshToken := generators.GetARefreshToken(id)
	if errJwt != nil {
		return nil, errJwt
	}
	var ( // From the db
		username string
		rolefk int
		avatarPath *string
	)
	err := db.DB.QueryRow("SELECT username, rolefk, generatedPath FROM testuser.user LEFT JOIN testuser.avatar ON testuser.avatar.userfk = testuser.user.id WHERE id = $1", id).Scan(&username, &rolefk, &avatarPath)
	if err != nil {
		return nil, status.Error(codes.NotFound, "User not found")
	}
	var avatarPathStr string
	if(avatarPath != nil){
		resS3, err :=		s3.PresignedGet(*avatarPath)
		if err != nil {
			log.Printf("Error getting the avatar from s3: %v", err)
		}
		avatarPathStr = resS3.URL
		// TODO: Get the avatar from the s3 bucket
		// url, errS := s3Client.SignedGetURL(*avatarPath)
		// if errS == nil {
		// 	avatarPathStr = url.String()
		// }
		
		
	}
	var userRole = pb.Role(rolefk)
	
	////log.Printf("User role: %v", userRole)

	return &pb.DefaultAuthResponse{
		AccessToken: accessToken,
		RefreshToken: refreshToken,
		
		User: &pb.User{ Id: int32(id), Username: username, Avatar: avatarPathStr, Role: userRole},
	}, nil
}


func (s *AuthServer) Register(ctx context.Context, in *pb.RegisterRequest) (*pb.DefaultAuthResponse, error) {
	////log.Printf("Received: %v", in)
	var ( // Incoming
		usernameIn string = in.Username
		passwordIn string = in.Password
	)
	err := validator.ValidateUsername(usernameIn)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}
	err = validator.ValidatePassword(passwordIn)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}
	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(passwordIn), 8)
	if err != nil {
		////log.Printf("Error hashing password: %v", err)
		return nil, status.Error(codes.Internal, "Something went wrong")
	}
	// Create the user
	var id int
	const role = pb.Role_USER // User
	err = db.DB.QueryRow("INSERT INTO testuser.user (username, password, rolefk) VALUES ($1, $2, $3) RETURNING id", usernameIn, hashedPassword, role).Scan(&id)
	if err != nil {
		return nil, status.Error(codes.AlreadyExists, "Username already exists")
	}
	defaultAuthResponse, err := createDefaultAuthResponse(id)
	if err != nil {
		return nil, err
	}
	return defaultAuthResponse, nil
}

func (s *AuthServer) RefreshToken (ctx context.Context, in *pb.RefreshTokenRequest) (*pb.DefaultAuthResponse, error) {
	////log.Printf("Received: %v", in)
	var ( // Incoming
		refreshTokenIn string = in.RefreshToken
	)
	// RefreshToken is a 64 byte string
	if len(refreshTokenIn) != 64 {
		////log.Printf("Refresh token is not 64 bytes")
		return nil, status.Error(codes.InvalidArgument, "Invalid refresh token")
	}
	// Check if the refresh token exists in redis
	userId, err := redis.RedisClient.Get(context.Background(), refreshTokenIn).Result()
	if err != nil {
		////log.Printf("Error getting refresh token from redis: %v", err)
		return nil, status.Error(codes.Unauthenticated, "Invalid refresh token")
	}
	// log.Printf("Looked for refresh token %v and found user id %v", refreshTokenIn, userId)


	userIdInt, err := strconv.Atoi(userId)
	if err != nil {
		////log.Printf("Error converting userId to int: %v", err)
		return nil, status.Error(codes.Internal, "Something went wrong")
	}
	
	defaultAuthResponse, err := createDefaultAuthResponse(userIdInt)
	if err != nil {
		////log.Printf("Error creating default auth response: %v", err)
		return nil, err
	}
	// Delete the old refresh token from redis after 1 Minute
	redis.RedisClient.Del(context.Background(), refreshTokenIn)

	_, err = redis.RedisClient.Del(context.Background(), refreshTokenIn).Result()
	if err != nil {
		log.Fatalf("Error deleting refresh token: %v", err)
		return nil, status.Error(codes.Internal, "Something went wrong")
	}
	return defaultAuthResponse, nil
}

func (s *AuthServer) Logout (ctx context.Context, in *pb.LogoutRequest) (*pb.LogoutResponse, error) {
	////log.Printf("Received: %v", in)
	var ( // Incoming
		refreshTokenIn string = in.RefreshToken
	)
	// RefreshToken is a 64 byte string
	if len(refreshTokenIn) != 64 {
		return nil, status.Error(codes.InvalidArgument, "Invalid refresh token")
	}
	
	// Delete the refresh token
	_, err := redis.RedisClient.Del(context.Background(), refreshTokenIn).Result()
	if err != nil {
		log.Fatalf("Error deleting refresh token: %v", err)
		return nil, status.Error(codes.Internal, "Something went wrong")
	}
	return &pb.LogoutResponse{
		Success: true,
	}, nil
}

func (s *AuthServer) EnableTOTP(ctx context.Context, in *pb.EnableTOTPRequest) (*pb.EnableTOTPResponse, error){
	var ( // Incoming
		passwordIn string = in.Password
	)
	// _ = passwordIn
	id, username, _, err := verifyInMetadataAuthToken(ctx)
	if err != nil {
		return nil, err
	}
	// Check if the user already has TOTP enabled
	var totpEnabled sql.NullBool
	var secret sql.NullString
	var password string
	err = db.DB.QueryRow("SELECT password, verified, secretbase32 FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user_2fa.userfk = testuser.user.id WHERE testuser.user.id = $1", id).Scan(&password, &totpEnabled, &secret)
	
	if err != nil {
		if err == sql.ErrNoRows {
			// User does not have TOTP enabled	
		} else {
			//log.Printf("Error checking if user has TOTP enabled: %v", err)
			return nil, status.Error(codes.Internal, "Something went wrong")
		}
	}
	// Check if the password is correct
	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(passwordIn))
	if err != nil {
		//log.Printf("Error comparing password hashes: %v", err)
		return nil, status.Error(codes.Unauthenticated, "Invalid password")
	}
	if totpEnabled.Valid {
		//log.Printf("User already has TOTP enabled")
		return nil, status.Error(codes.AlreadyExists, "TOTP already enabled")
	}

	// Generate a secret
	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:  "GO-GRPC-Auth",
		AccountName: 		*username,
	})
	if err != nil {
		////log.Printf("Error generating TOTP secret: %v", err)
		return nil, status.Error(codes.Internal, "Something went wrong")
	}
	// Insert the secret into the database
	// _, err = db.DB.Exec("INSERT INTO testuser.user_2fa (userfk, secretbase32) VALUES ($1, $2)", id, key.Secret())
	_, err = db.DB.Exec("INSERT INTO testuser.user_2fa (userfk, secretbase32) VALUES ($1, $2) ON CONFLICT (userfk) DO UPDATE SET secretbase32 = $2", id, key.Secret())

	if err != nil {
		////log.Printf("Error inserting TOTP secret into database: %v", err)
		return nil, status.Error(codes.Internal, "Something went wrong")
	}


	return &pb.EnableTOTPResponse{
		Secret: key.Secret(),
		Url: key.URL(),
	}, nil
}

func (s *AuthServer) VerifyTOTP(ctx context.Context, in *pb.VerifyTOTPRequest) (*pb.VerifyTOTPResponse, error){
	var ( //incoming
		totpIn string = in.TotpCode
	)
	userId, _, _, err := verifyInMetadataAuthToken(ctx)
	if err != nil {
		return nil, err
	}
	if len(totpIn) != 6 {
		return nil, status.Error(codes.InvalidArgument, "Invalid TOTP code")
	}
	// Check if the user has TOTP enabled
	var alreadyVerified sql.NullBool
	var secret string
	err = db.DB.QueryRow("SELECT verified, secretbase32 FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user.id = user_2fa.userfk WHERE testuser.user.id = $1", userId).Scan(&alreadyVerified, &secret)
	// Secret should not be empty, but veified should be false
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, status.Error(codes.NotFound, "TOTP not enabled")
		} else {
		////log.Printf("Error checking if user has TOTP enabled: %v", err)
		return nil, status.Error(codes.Internal, "Something went wrong")
		}
	}
	if alreadyVerified.Bool { 
			return nil, status.Error(codes.AlreadyExists, "TOTP already verified")
	}
	// Verify the TOTP code
	valid := totp.Validate(totpIn, secret)
	if !valid {
		return nil, status.Error(codes.Unauthenticated, "Invalid TOTP code")
	}
	// Update the database to set verified to true
	_, err = db.DB.Exec("UPDATE testuser.user_2fa SET verified = true WHERE userfk = $1", userId)
	if err != nil {
		////log.Printf("Error updating TOTP verification status: %v", err)
		return nil, status.Error(codes.Internal, "Something went wrong")
	}
	return &pb.VerifyTOTPResponse{
		Success: true,
	}, nil
}

func (s *AuthServer) DisableTOTP(ctx context.Context, in *pb.DisableTOTPRequest) (*pb.DisableTOTPResponse, error){
	userId, _, _, err := verifyInMetadataAuthToken(ctx)
	if err != nil {
		return nil, err
	}
	
	var (
		passwordIn string = in.Password
		totpIn string = in.TotpCode
	)
    //Verify the password and TOTP code
	var passwordHash string
	var totpEnabled bool
	var secret string
	err = db.DB.QueryRow("SELECT password, verified, secretbase32 FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user.id = user_2fa.userfk WHERE testuser.user.id = $1", userId).Scan(&passwordHash, &totpEnabled, &secret)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, status.Error(codes.NotFound, "User not found")
		} else {
			////log.Printf("Error checking if user has TOTP enabled: %v", err)
			return nil, status.Error(codes.Internal, "Something went wrong")
		}
	}
	if !totpEnabled {
		return nil, status.Error(codes.NotFound, "TOTP not enabled")
	}
	if !totp.Validate(totpIn, secret) {
		return nil, status.Error(codes.InvalidArgument, "Invalid TOTP code")
	}
	// bcrypt.CompareHashAndPassword()
	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(passwordIn))
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "Invalid password")
	}
	// Delete the TOTP secret from the database
	_, err = db.DB.Exec("DELETE FROM testuser.user_2fa WHERE userfk = $1", userId)
	if err != nil {
		////log.Printf("Error deleting TOTP secret from database: %v", err)
		return nil, status.Error(codes.Internal, "Something went wrong")
	}
	return &pb.DisableTOTPResponse{
		Success: true,
	}, nil
}

func (s *AuthServer) Status(ctx context.Context, in *pb.StatusRequest) (*pb.StatusResponse, error){
	userId, _, _, err := verifyInMetadataAuthToken(ctx)
	if err != nil {
		return nil, err
	}
	// Check if totp is enabled and get user
	var totpEnabled sql.NullBool
	var username string
	var rolefk int
	// Nullable string avatar
	var avatar sql.NullString
	// var avatar string
	err = db.DB.QueryRow("SELECT verified, username, rolefk, generatedPath FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user.id = user_2fa.userfk LEFT JOIN testuser.avatar ON testuser.user.id = avatar.userfk WHERE testuser.user.id = $1", userId).Scan(&totpEnabled, &username, &rolefk, &avatar)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, status.Error(codes.NotFound, "User not found")
		} else {
			////log.Printf("Error checking if user has TOTP enabled: %v", err)
			return nil, status.Error(codes.Internal, "Something went wrong")
		}
	}
	// userIdInt := int32(userId)
	return &pb.StatusResponse{
		User: &pb.User{
			Id: int32(*userId),
			Username: username,
			Role: pb.Role(rolefk),
			Avatar: avatar.String,
		},
		TotpEnabled: totpEnabled.Bool,

	}, nil
}



// verifyInMetadataAuthToken verifies the auth token in the metadata and returns the user id, username, role OR error
func verifyInMetadataAuthToken(ctx context.Context) (*int, *string, *pb.Role, error){
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, nil,nil, status.Error(codes.Unauthenticated, "No metadata found")
	}
	authToken := md.Get("authorization")
	if len(authToken) == 0 {
		return nil, nil,nil, status.Error(codes.Unauthenticated, "No authorization token found")
	}
	////log.Printf("Auth token: %v", authToken[0])
	// Cut off the "Bearer " part if it exists
	authTokenString :=	strings.TrimPrefix(authToken[0], "Bearer ")
	// Verify the token
	userId, err := generators.VerifyJwt(authTokenString)
	if err != nil {
		////log.Printf("Error verifying jwt: %v", err)
		return nil, nil,nil, status.Error(codes.Unauthenticated, "Invalid token")
	}
	// Get the username and role
	var username string
	var roleInt int
	err = db.DB.QueryRow("SELECT username, rolefk FROM testuser.user WHERE id = $1", userId).Scan(&username, &roleInt)
	if err != nil {
		////log.Printf("Error getting user role: %v", err)
		return nil, nil,nil, status.Error(codes.Internal, "Something went wrong")
	}
	////log.Printf("ID: %v, Role: %v", userId, roleInt)
	var role = pb.Role(roleInt)
	return &userId, &username, &role, nil
}