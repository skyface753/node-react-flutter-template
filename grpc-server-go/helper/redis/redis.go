package redis

import (
	"fmt"
	"strconv"
	"template/server/helper/envget"

	"github.com/go-redis/redis/v9"
)

var (
	// RedisClient is the redis client
	RedisClient *redis.Client
)

// InitRedis initializes the redis client
func InitRedis() {
	var host = envget.GetEnv("REDIS_HOST", "localhost")
	var port = envget.GetEnv("REDIS_PORT", "6379")
	var password = envget.GetEnv("REDIS_PASSWORD", "")
	var db, err = strconv.Atoi(envget.GetEnv("REDIS_DB", "0"))
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

