package dbPlain

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type DB struct {
	*sql.DB
}
var connStr string = "postgres://testuser:password@localhost:5432/testdb?sslmode=disable"

func NewDB() (*DB, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}
	return &DB{db}, nil
}

func (db *DB) Close() error {
	return db.DB.Close()
}

