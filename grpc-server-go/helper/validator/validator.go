package validator

import (
	"fmt"
	"regexp"
)

/**
*Only alphanumeric characters, underscore and hyphen no spaces (min 3, max 20)
**/
func ValidateUsername(username string) error {
	// Check if username is empty
	if username == "" {
		return fmt.Errorf("username cannot be empty")
	}

	// Check if username is between 3 and 20 characters
	if len(username) < 3 || len(username) > 20 {
		return fmt.Errorf("username must be between 3 and 20 characters")
	}

	// Check if username is alphanumeric
	if !regexp.MustCompile(`^[a-zA-Z0-9_-]+$`).MatchString(username) {
		return fmt.Errorf("username must be alphanumeric")
	}

	return nil
}

/**
*   Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
**/
func ValidatePassword(password string) error {
	// Check if password is empty
	if password == "" {
		return fmt.Errorf("password cannot be empty")
	}

	// Check if password is between 8 and 20 characters
	if len(password) < 8 || len(password) > 20 {
		return fmt.Errorf("password must be between 8 and 20 characters")
	}

	// Check if password has at least one uppercase letter
	if !regexp.MustCompile(`[A-Z]`).MatchString(password) {
		return fmt.Errorf("password must have at least one uppercase letter")
	}

	// Check if password has at least one lowercase letter
	if !regexp.MustCompile(`[a-z]`).MatchString(password) {
		return fmt.Errorf("password must have at least one lowercase letter")
	}

	// Check if password has at least one number
	if !regexp.MustCompile(`[0-9]`).MatchString(password) {
		return fmt.Errorf("password must have at least one number")
	}

	// Check if password has at least one special character
	if !regexp.MustCompile(`[!@#$%^&*]`).MatchString(password) {
		return fmt.Errorf("password must have at least one special character")
	}

	return nil
}
