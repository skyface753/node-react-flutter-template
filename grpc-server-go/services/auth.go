package services

import (
	"context"
	"log"
	"strconv"
	db "template/server/helper/db"
	"template/server/helper/generators"
	"template/server/helper/redis"
	"template/server/helper/validator"
	pb "template/server/pb/template"
	dbPrisma "template/server/prisma/db"

	"github.com/pquerna/otp/totp"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type authServer struct {
	pb.UnimplementedAuthServiceServer
	prismaClient *dbPrisma.PrismaClient
} 

func NewAuthServer(prismaClient *dbPrisma.PrismaClient) *authServer {
	return &authServer{
		prismaClient: prismaClient,
	}
}

func (s *authServer) Login(ctx context.Context, in *pb.LoginRequest) (*pb.DefaultAuthResponse, error) {
	

	log.Printf("Received: %v", in)

	var ( // Incoming 
		usernameIn string = in.Username
		passwordIn string = in.Password
		totpIn *string = in.TotpCode
		
	)
	var ( // From the db
		id int
		username string
		password string
		rolefk int
		secretbase32 *string
		verified *bool
		avatarPath *string
	)
	
	err := db.DB.QueryRow("SELECT id, username, password, rolefk, secretbase32, verified, generatedPath FROM testuser.user LEFT JOIN testuser.user_2fa ON testuser.user.id = testuser.user_2fa.userfk LEFT JOIN testuser.avatar ON testuser.avatar.userfk = testuser.user.id WHERE username = $1", usernameIn).Scan(&id, &username, &password, &rolefk, &secretbase32, &verified, &avatarPath)
	if err != nil {
		return nil, status.Error(codes.NotFound, "User not found")
	}
	
	_ = totpIn
	// Compare the stored hashed password, with the hashed version of the password that was received
	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(passwordIn))
	if err != nil {
		return nil, err
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
	accessToken, errJwt := generators.GenerateJwt(id)
	refreshToken := generators.GetARefreshToken(id)
	if errJwt != nil {
		return nil, errJwt
	}
	var avatarPathStr string
	if(avatarPath != nil){
		avatarPathStr = *avatarPath
	}
	var userRole = pb.Role(pb.Role_USER)
	if(rolefk == 2){
		userRole = pb.Role(pb.Role_ADMIN)
	}
	log.Printf("User role: %v", userRole)

	return &pb.DefaultAuthResponse{
		AccessToken: accessToken,
		RefreshToken: refreshToken,
		
		User: &pb.User{ Id: int32(id), Username: username, Avatar: avatarPathStr, Role: userRole},
	}, nil

	
	
}



func (s *authServer) Register(ctx context.Context, in *pb.RegisterRequest) (*pb.DefaultAuthResponse, error) {
	log.Printf("Received: %v", in)
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
		log.Printf("Error hashing password: %v", err)
		return nil, status.Error(codes.Internal, "Something went wrong")
	}
	// Create the user
	var id int
	const role = 1 // User
	err = db.DB.QueryRow("INSERT INTO testuser.user (username, password, rolefk) VALUES ($1, $2, $3) RETURNING id", usernameIn, hashedPassword, role).Scan(&id)
	if err != nil {
		return nil, status.Error(codes.AlreadyExists, "Username already exists")
	}
	accessToken, errJwt := generators.GenerateJwt(id)
	refreshToken := generators.GetARefreshToken(id)
	if errJwt != nil {
		log.Printf("Error generating jwt: %v", errJwt)
		return nil, status.Error(codes.Internal, "Something went wrong")
	}
	return &pb.DefaultAuthResponse{
		AccessToken: accessToken,
		RefreshToken: refreshToken,
		User: &pb.User{ Id: int32(id), Username: usernameIn, Role: pb.Role(pb.Role_USER)},
	}, nil
}


func (s *authServer) RefreshToken (ctx context.Context, in *pb.RefreshTokenRequest) (*pb.DefaultAuthResponse, error) {
	log.Printf("Received: %v", in)
	var ( // Incoming
		refreshTokenIn string = in.RefreshToken
	)
	// RefreshToken is a 64 byte string
	if len(refreshTokenIn) != 64 {
		return nil, status.Error(codes.InvalidArgument, "Invalid refresh token")
	}
	// Check if the refresh token exists in redis
	userId, err := redis.RedisClient.Get(context.Background(), refreshTokenIn).Result()
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "Invalid refresh token")
	}
	userIdInt, err := strconv.Atoi(userId)
	if err != nil {
		return nil, status.Error(codes.Internal, "Something went wrong")
	}
	// Generate a new access token
	accessToken, errJwt := generators.GenerateJwt(userIdInt)
	if errJwt != nil {
		return nil, errJwt
	}
	// Generate a new refresh token
	refreshToken := generators.GetARefreshToken(userIdInt)
	// Delete the old refresh token
	_, err = redis.RedisClient.Del(context.Background(), refreshTokenIn).Result()
	if err != nil {
		log.Fatalf("Error deleting refresh token: %v", err)
		return nil, status.Error(codes.Internal, "Something went wrong")
	}
	return &pb.DefaultAuthResponse{
		AccessToken: accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *authServer) Logout (ctx context.Context, in *pb.LogoutRequest) (*pb.LogoutResponse, error) {
	log.Printf("Received: %v", in)
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