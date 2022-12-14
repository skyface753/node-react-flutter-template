package getenv_test

import (
	"os"
	"template/server/helper/getenv"
	"testing"
)

func TestGetEnv(t *testing.T) {
	// Test for fallback
	s := getenv.GetEnv("TEST", "fallback")
	if s != "fallback" {
		t.Errorf("Expected fallback, got %s", s)
	}
	// Set env variable
	os.Setenv("TEST", "test") // TEST=test
	s = getenv.GetEnv("TEST", "fallback")
	if s != "test" {
		t.Errorf("Expected test, got %s", s)
	}
}