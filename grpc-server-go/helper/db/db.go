package db

// Postgres DB

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strconv"
	"template/server/helper/envget"
	"time"

	_ "github.com/lib/pq"
)

var (
	// DB is the database connection
	DB *sql.DB
)





// InitDB initializes the database connection
func InitDB()  {
	var (
		host     = envget.GetEnv("POSTGRES_HOST", "localhost") 
		port, pError  = strconv.Atoi(envget.GetEnv("POSTGRES_PORT", "5432"))
		user     = envget.GetEnv("POSTGRES_USER", "testuser")
		password = envget.GetEnv("POSTGRES_PASSWORD", "password")
		dbname   = envget.GetEnv("POSTGRES_DB", "testdb")
		sslm     = envget.GetEnv("POSTGRES_SSLMODE", "disable")
	)
	if pError != nil {
		port = 5432
	}
	
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s connect_timeout=10", host, port, user, password, dbname, sslm)
	
	
	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(25)
	DB.SetConnMaxLifetime(5 * time.Minute)

	ctxBG := context.Background()
	ctxPingTimeout, cancel := context.WithTimeout(ctxBG, 1*time.Second)
	defer cancel()

	err = DB.PingContext(ctxPingTimeout)
	if err != nil {
		log.Fatalf("Error pinging database: %v", err)
	}
	//fmt.Println("Successfully connected to database!")
}

// CloseDB closes the database connection
func CloseDB() {
	err := DB.Close()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Successfully closed database connection!")
}
