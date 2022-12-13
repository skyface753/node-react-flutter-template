package redis

import (
	"fmt"
	"strconv"
	"template/server/helper/getenv"

	"github.com/go-redis/redis/v9"
)

var (
	// RedisClient is the redis client
	RedisClient *redis.Client
)

// InitRedis initializes the redis client
func InitRedis() {
	var host = getenv.GetEnv("REDIS_HOST", "localhost")
	var port = getenv.GetEnv("REDIS_PORT", "6379")
	var password = getenv.GetEnv("REDIS_PASSWORD", "")
	var db, err = strconv.Atoi(getenv.GetEnv("REDIS_DB", "0"))
	if err != nil {
		db = 0
	}
	addr := fmt.Sprintf("%s:%s", host, port)
	
	RedisClient = redis.NewClient(&redis.Options{
		Addr:   addr,
		Password: password,
		DB:    db,
	})
}

// CloseRedis closes the redis client
func CloseRedis() {
	err := RedisClient.Close()
	if err != nil {
		panic(err)
	}
}

