package generators_test

import (
	"strings"
	"template/server/helper/generators"
	"testing"
)

func TestJwt(t *testing.T) {
	t.Parallel()
	// Test for length
	s, err := generators.GenerateJwt(10)
	if err != nil {
		t.Errorf("Error: %v", err)
	}
	t.Logf("Token: %v", s)
	// Verify token
	userId, err := generators.VerifyJwt(s)
	if err != nil {
		t.Errorf("Error: %v", err)
	}
	t.Logf("User ID: %v", userId)
	if userId != 10 {
		t.Errorf("Expected 10, got %d", userId)
	}
	splitted := strings.Split(s, ".")
	for i, v := range splitted {
		splitted[i] = v + "a"
	}
	s = strings.Join(splitted, ".")
	t.Logf("Token (manipulated): %v", s)
	userId, err = generators.VerifyJwt(s)
	if err == nil {
		t.Errorf("Expected error, got %d", userId)
	}
	t.Logf("Error: %v", err)
}

func TestS3Jwt(t *testing.T) {
	t.Parallel()
	filename  := "test.png"
	originalName := "test.png"
	fileType := "image/png"
	// Test for length
	s, err := generators.GenerateJwtForS3Upload(filename, originalName, fileType)
	if err != nil {
		t.Errorf("Error: %v", err)
	}
	t.Logf("Token: %v", s)
	// Verify token
	filename, originalName, fileType, err = generators.VerifyJwtForS3Upload(s)
	if err != nil {
		t.Errorf("Error: %v", err)
	}
	t.Logf("Filename: %v", filename)
	t.Logf("Original Name: %v", originalName)
	t.Logf("File Type: %v", fileType)
	if filename != "test.png" {
		t.Errorf("Expected test.png, got %s", filename)
	}
	if originalName != "test.png" {
		t.Errorf("Expected test.png, got %s", originalName)
	}
	if fileType != "image/png" {
		t.Errorf("Expected image/png, got %s", fileType)
	}
	// Manipulate token
	// add a to each block
	splitted := strings.Split(s, ".")
	for i, v := range splitted {
		splitted[i] = v + "a"
	}
	s = strings.Join(splitted, ".")
	t.Logf("Token (manipulated): %v", s)	
	filename, _, _, err = generators.VerifyJwtForS3Upload(s)
	if err == nil {
		t.Errorf("Expected error, got %s", filename)
	}
	t.Logf("Error: %v", err)
}
	