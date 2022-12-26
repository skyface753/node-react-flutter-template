package generators_test

import (
	"template/server/helper/generators"
	"testing"
	"time"
)

func TestGetRandomString(t *testing.T) {
	t.Parallel()
	// Test for length
	s := generators.GetRandomString(10)
		if len(s) != 10 {
		t.Errorf("Expected length 10, got %d", len(s))
	}
	// Start time
	t1 := time.Now()
	s = generators.GetRandomString(100)
	// End time
	t2 := time.Now()
	// Test for time
	if t2.Sub(t1) > time.Second {
		t.Errorf("Expected time less than 1 second, got %s", t2.Sub(t1))
	}else{
		t.Logf("Expected time less than 1 second, got %s", t2.Sub(t1))
	}
	if len(s) != 100 {
		t.Errorf("Expected length 100, got %d", len(s))
	}

	// Test for randomness
	s1 := generators.GetRandomString(10)
	s2 := generators.GetRandomString(10)
	if s1 == s2 {
		t.Errorf("Expected random strings, got %s and %s", s1, s2)
	}
}

var result []string
func BenchmarkGetRandomString(b *testing.B) {
	for i := 0; i < b.N; i++ {
		result = append(result, generators.GetRandomString(100))
		// hi := generators.GetRandomString(100)
	}
}