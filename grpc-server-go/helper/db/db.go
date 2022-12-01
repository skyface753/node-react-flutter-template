package db

// Postgres DB

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
)

var (
	// DB is the database connection
	DB *sql.DB
)

// var connStr string = "postgres://testuser:password@localhost:5432/testdb?sslmode=disable"
const (
	connStr = "postgres://testuser:password@localhost:5432/testdb?sslmode=disable"
)




// InitDB initializes the database connection
func InitDB() {
	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(25)
	DB.SetConnMaxLifetime(5 * time.Minute)

	err = DB.Ping()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Successfully connected to database!")
}

// CloseDB closes the database connection
func CloseDB() {
	err := DB.Close()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Successfully closed database connection!")
}
