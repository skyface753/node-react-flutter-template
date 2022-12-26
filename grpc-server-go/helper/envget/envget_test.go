package envget_test

import (
	"os"
	"template/server/helper/envget"
	"testing"
)

func TestGetEnv(t *testing.T) {
	t.Parallel()
	// Test for fallback
	s := envget.GetEnv("TEST", "fallback")
	if s != "fallback" {
		t.Errorf("Expected fallback, got %s", s)
	}
	// Set env variable
	os.Setenv("TEST", "test") // TEST=test
	s = envget.GetEnv("TEST", "fallback")
	if s != "test" {
		t.Errorf("Expected test, got %s", s)
	}
}