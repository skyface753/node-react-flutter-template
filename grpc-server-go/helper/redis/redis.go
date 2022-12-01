package redis

import (
	"github.com/go-redis/redis/v9"
)

var (
	// RedisClient is the redis client
	RedisClient *redis.Client
)

// InitRedis initializes the redis client
func InitRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})
}

// CloseRedis closes the redis client
func CloseRedis() {
	err := RedisClient.Close()
	if err != nil {
		panic(err)
	}
}

