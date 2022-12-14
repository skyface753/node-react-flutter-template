package validator_test

import (
	"template/server/helper/validator"
	"testing"
)

// *Only alphanumeric characters, underscore and hyphen no spaces (min 3, max 20)
func TestValidateUsername(t *testing.T) {
	// Test for empty username
	err := validator.ValidateUsername("")
	if err == nil {
		t.Errorf("Expected error, got nil")
	}
	// Test for username less than 3 characters
	err = validator.ValidateUsername("ab")
	if err == nil {
		t.Errorf("Expected error, got nil")
	}
	// Test for username more than 20 characters
	err = validator.ValidateUsername("abcdefghijklmnopqrstuvwxyz")
	if err == nil {
		t.Errorf("Expected error, got nil")
	}
	// Test for username with non-alphanumeric characters
	err = validator.ValidateUsername("abc123!@#")
	if err == nil {
		t.Errorf("Expected error, got nil")
	}
	// Test for valid username
	err = validator.ValidateUsername("abc123")
	if err != nil {
		t.Errorf("Expected nil, got error")
	}
}

// *   Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
func TestValidatePassword(t *testing.T) {
	// Test for empty password
	err := validator.ValidatePassword("")
	if err == nil {
		t.Errorf("Expected error, got nil - empty password")
	}
	// Test for password less than 8 characters
	err = validator.ValidatePassword("abc123")
	if err == nil {
		t.Errorf("Expected error, got nil - password less than 8 characters")
	}
	// Test for password more than 20 characters
	err = validator.ValidatePassword("abcdefghijklmnopqrstuvwxyz")
	if err == nil {
		t.Errorf("Expected error, got nil - password more than 20 characters")
	}
	// Test for password with no uppercase letter
	err = validator.ValidatePassword("abc123!@#")
	if err == nil {
		t.Errorf("Expected error, got nil - password with no uppercase letter")
	}
	// Test for password with no lowercase letter
	err = validator.ValidatePassword("ABC123!@#")
	if err == nil {
		t.Errorf("Expected error, got nil - password with no lowercase letter")
	}
	// Test for password with no number
	err = validator.ValidatePassword("abc!@#")
	if err == nil {
		t.Errorf("Expected error, got nil - password with no number")
	}
	// Test for password with no special character
	err = validator.ValidatePassword("abc123w1sqd")
	if err == nil {
		t.Errorf("Expected error, got nil - password with no special character")
	}
	// Test for valid password
	err = validator.ValidatePassword("Abc123!@#")
	if err != nil {
		t.Errorf("Expected nil, got error")
	}
}
