package generators

import (
	"context"
	"log"
	"template/server/helper/envget"
	"template/server/helper/redis"
	"time"

	"github.com/golang-jwt/jwt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

/*
RefreshToken
Random string length 32
*/
// const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"



func GetARefreshToken(id int) (*string, error) {
	//TODO: REDIS
	rToken := randStringBytesMaskImpr(64)
	rStatusCommand := redis.RedisClient.Set(context.Background(), rToken, id, time.Hour*24*7) // 7 days
	_, err := rStatusCommand.Result()
	if err != nil {
		log.Printf("Error SET REDIS: %v", err)
		return nil, status.Errorf(codes.Internal, "Error SET REDIS: %v", err)
	}
	return &rToken, nil
}

// func generateRefreshToken() string {
// 	const length = 64
//     b := make([]byte, length)
//     for i := range b {
//         b[i] = letterBytes[rand.Intn(len(letterBytes))]
//     }
//     return string(b)
// }

//

//

func GenerateJwt(id int) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": id,
		// "exp":  time.Now().Add(time.Hour * 24).Unix(),
		"exp":  time.Now().Add(time.Minute * 5).Unix(),
		// "exp":  time.Now().Add(time.Second * 30).Unix(),
	})

	var jwtSecret = envget.GetEnv("JWT_SECRET", "secret");
	
	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		log.Printf("Error GEN JWT: %v", err)
		return "", err
	}
	return tokenString, nil
}

func GenerateJwtForS3Upload(filename string, originalName string, fileType string) (string, error){
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"filename": filename,
		"originalName": originalName,
		"fileType": fileType,
		"exp":  time.Now().Add(time.Minute * 5).Unix(),
	})

	var jwtSecret = envget.GetEnv("JWT_SECRET", "secret");

	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		log.Printf("Error GEN JWT: %v", err)
		return "", err
	}
	return tokenString, nil

}

func VerifyJwt(tokenString string) (int, error) {
	var jwtSecret = envget.GetEnv("JWT_SECRET", "secret");
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, status.Error(codes.Unauthenticated, "Invalid token")
		}
		return []byte(jwtSecret), nil
	})
	if err != nil {
		return 0, status.Error(codes.Unauthenticated, "Invalid token")
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// interface {} is float64, not int
		userId := int(claims["id"].(float64))
		return userId, nil
	}
	return 0, status.Error(codes.Unauthenticated, "Invalid token")
}

func VerifyJwtForS3Upload(tokenString string) (string, string, string, error) {
	var jwtSecret = envget.GetEnv("JWT_SECRET", "secret");
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, status.Error(codes.Unauthenticated, "Invalid token")
		}
		return []byte(jwtSecret), nil
	})
	if err != nil {
		return "", "", "", status.Error(codes.Unauthenticated, "Invalid token")
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// interface {} is float64, not int
		filename := claims["filename"].(string)
		originalName := claims["originalName"].(string)
		fileType := claims["fileType"].(string)
		return filename, originalName, fileType, nil
	}
	return "", "", "", status.Error(codes.Unauthenticated, "Invalid token")
}