package generators

import (
	"context"
	"log"
	"math/rand"
	"os"
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
const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"



func GetARefreshToken(id int) string {
	//TODO: REDIS
	rToken := generateRefreshToken()
	redis.RedisClient.Set(context.Background(), rToken, id, time.Hour*24*7) // 7 days
	return rToken
}

func generateRefreshToken() string {
	const length = 64
    b := make([]byte, length)
    for i := range b {
        b[i] = letterBytes[rand.Intn(len(letterBytes))]
    }
    return string(b)
}

func GenerateJwt(id int) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": id,
		// "exp":  time.Now().Add(time.Hour * 24).Unix(),
		"exp":  time.Now().Add(time.Minute * 5).Unix(),
	})


	var jwtSecret string = os.Getenv("JWT_SECRET")
	if(jwtSecret == "") {
		jwtSecret = "secret"
	}
	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		log.Printf("Error GEN JWT: %v", err)
		return "", err
	}
	return tokenString, nil
}

func VerifyJwt(tokenString string) (int, error) {
	var jwtSecret string = os.Getenv("JWT_SECRET")
	if(jwtSecret == "") {
		jwtSecret = "secret"
	}
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