package generators

import (
	"context"
	"log"
	"math/rand"
	"os"
	"template/server/helper/redis"
	"time"

	"github.com/golang-jwt/jwt"
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
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
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
