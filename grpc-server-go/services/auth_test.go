package services_test

import (
	"context"
	"errors"
	"log"
	"net"
	"sync"
	"testing"
	"time"

	pb "template/server/grpc-proto"
	db "template/server/helper/db"
	"template/server/helper/redis"
	"template/server/helper/s3"
	"template/server/services"

	totpGen "github.com/pquerna/otp/totp"
	"google.golang.org/grpc"

	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/test/bufconn"
)

func server(ctx context.Context) (pb.AuthServiceClient, func()) {
	buffer := 101024 * 1024
	lis := bufconn.Listen(buffer)

	baseServer := grpc.NewServer()
	pb.RegisterAuthServiceServer(baseServer, &services.AuthServer{})
	go func() {
		if err := baseServer.Serve(lis); err != nil {
			log.Printf("error serving server: %v", err)
		}
	}()

	// INIT
	db.InitDB()
	redis.InitRedis()
	s3.NewClient()

	conn, err := grpc.DialContext(ctx, "",
		grpc.WithContextDialer(func(context.Context, string) (net.Conn, error) {
			return lis.Dial()
		}), grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Printf("error connecting to server: %v", err)
	}

	closer := func() {
		err := lis.Close()
		if err != nil {
			log.Printf("error closing listener: %v", err)
		}
		baseServer.Stop()
	}

	client := pb.NewAuthServiceClient(conn)

	return client, closer
}

func TestAuthServer(t *testing.T) {
	if testing.Short() {
        t.Skip("skipping integration test")
    }
	ctx := context.Background()

	client, closer := server(ctx)
	defer closer()

	// Clear user_2fa
	db.DB.Query("DELETE FROM user_2fa")

	// Waitgroup
	wg := sync.WaitGroup{}
	wg.Add(6)

	go func() {
		defer wg.Done()
		login(t, ctx, client)
	}()
	go func() {
		defer wg.Done()
		register(t, ctx, client)
	}()
	go func() {
		defer wg.Done()
		refreshToken(t, ctx, client)
	}()
	go func() {
		defer wg.Done()
		logout(t, ctx, client)
	}()
	go func() {
		defer wg.Done()
		status(t, ctx, client)
	}()
	go func() {
		defer wg.Done()
		totp(t, ctx, client)
	}()

	// // Wait for the goroutines to finish.
	wg.Wait()

}


func login(t *testing.T, ctx context.Context, client pb.AuthServiceClient) {
	type expectation struct {
		out *pb.DefaultAuthResponse
		err error
	}
	tests := map[string]struct {
		in       *pb.LoginRequest
		expected expectation
	}{
		"Must_Success": {
			in: &pb.LoginRequest{
				Username: "admin",
				Password: "Admin123",
			},
			expected: expectation{
				out: &pb.DefaultAuthResponse{
					User: &pb.User{
						Username: "admin",
						Role: *pb.Role_ADMIN.Enum(),
					},
				},
				err: nil,
			},

		},
		"Not_Found_Username": {
			in: &pb.LoginRequest{
				Username: "test",
				Password: "Admin123",
			},
			expected: expectation{
				out: &pb.DefaultAuthResponse{},
				err: errors.New("rpc error: code = NotFound desc = User not found"),
			},
		},
		"Wrong_Password": {
			in: &pb.LoginRequest{
				Username: "admin",
				Password: "test",
			},
			expected: expectation{
				out: &pb.DefaultAuthResponse{},
				err: errors.New("rpc error: code = Unauthenticated desc = Wrong password"),
			},
		},
		"Empty_Username": {
			in: &pb.LoginRequest{
				Username: "",
				Password: "Admin123",
			},
			expected: expectation{
				out: &pb.DefaultAuthResponse{},
				err: errors.New("rpc error: code = NotFound desc = User not found"),
			},
		},
		"Empty_Password": {
			in: &pb.LoginRequest{
				Username: "admin",
				Password: "",
			},
			expected: expectation{
				out: &pb.DefaultAuthResponse{},
				err: errors.New("rpc error: code = Unauthenticated desc = Wrong password"),
			},
		},
	}

	for scenario, tt := range tests {
		t.Run("Login/" + scenario, func(t *testing.T) {
			out, err := client.Login(ctx, tt.in)
			if err != nil {
				if tt.expected.err.Error() != err.Error() {
					t.Errorf("Err -> \nWant: %q\nGot: %q\n", tt.expected.err, err)
				}else {
					if tt.expected.out.AccessToken != "" || tt.expected.out.RefreshToken != "" {
						t.Errorf("Tokens -> \nWant: <empty>\nGot: %q\n", out)
					}
				}
			} else {
				if tt.expected.out.User.Username != out.User.Username ||
					tt.expected.out.User.Role != out.User.Role {
					t.Errorf("Out -> \nWant: %q\nGot : %q", tt.expected.out, out)
				
				// Check tokens
				if tt.expected.out.AccessToken == "" || tt.expected.out.RefreshToken == "" {
					t.Errorf("Tokens -> \nWant: <not empty>\nGot: %q\n", out)
				}

			}

		}
	})

	}
}

func register(t *testing.T, ctx context.Context, client pb.AuthServiceClient){
	type expectation struct {
		out *pb.DefaultAuthResponse
		err error
	}
	tests := map[string]struct {
		in       *pb.RegisterRequest
		expected expectation
	}{
		"Must_Success": {
			in: &pb.RegisterRequest{
				Username: "test",
				Password: "Teasdst123@",
			},
			expected: expectation{
				out: &pb.DefaultAuthResponse{
					User: &pb.User{
						Username: "test",
						Role: *pb.Role_USER.Enum(),
					},
				},
				err: nil,
			},
		},	
		"Username_Exists": {
			in: &pb.RegisterRequest{
				Username: "admin",
				Password: "Teasdfst123@",
			},
			expected: expectation{
				out: &pb.DefaultAuthResponse{},
				err: errors.New("rpc error: code = AlreadyExists desc = Username already exists"),
			},
		},
		"Empty_Username": {
			in: &pb.RegisterRequest{
				Username: "",
				Password: "Test123",
			},
			expected: expectation{
				out: &pb.DefaultAuthResponse{},
				err: errors.New("rpc error: code = InvalidArgument desc = username cannot be empty"),
			},
		},
		"Empty_Password": {
			in: &pb.RegisterRequest{
				Username: "test2",
				Password: "",
			},
			expected: expectation{
				out: &pb.DefaultAuthResponse{},
				err: errors.New("rpc error: code = InvalidArgument desc = password cannot be empty"),
			},
		},
		"Invalid_Password-Too_Short": {
			in: &pb.RegisterRequest{
				Username: "test2",
				Password: "Test1",
			},
			expected: expectation{
				out: &pb.DefaultAuthResponse{},
				err: errors.New("rpc error: code = InvalidArgument desc = password must be between 8 and 20 characters"),
			},
		},

	}
	// Delete test user
	db.DB.Query("DELETE FROM testuser.user WHERE username = 'test'")

	for scenario, tt := range tests {
		t.Run("Register/" + scenario, func(t *testing.T) {
			out, err := client.Register(ctx, tt.in)
			if err != nil {
				if(tt.expected.err == nil){
					t.Errorf("Err -> \nWant: <nil> \nGot: %q", err)
				}
				if tt.expected.err.Error() != err.Error() {
					t.Errorf("Err -> \nWant: %q\nGot: %q\n", tt.expected.err, err)
				}else {
					if tt.expected.out.AccessToken != "" || tt.expected.out.RefreshToken != "" {
						t.Errorf("Tokens -> \nWant: <empty>\nGot: %q\n", out)
					}
				}
			} else {
				if tt.expected.out.User.Username != out.User.Username ||
					tt.expected.out.User.Role != out.User.Role {
					t.Errorf("Out -> \nWant: %q\nGot : %q", tt.expected.out, out)
				
				// Check tokens
				if tt.expected.out.AccessToken == "" || tt.expected.out.RefreshToken == "" {
					t.Errorf("Tokens -> \nWant: <not empty>\nGot: %q\n", out)
				}

			}

		}
	})

	}
	// Delete test user
	db.DB.Query("DELETE FROM testuser.user WHERE username = 'test'")
}

func refreshToken(t *testing.T, ctx context.Context, client pb.AuthServiceClient){
	type expectation struct {
		out *pb.DefaultAuthResponse
		err error
	}
	// First login to get refresh token
	out, err := client.Login(ctx, &pb.LoginRequest{
		Username: "admin",
		Password: "Admin123",
	})
	if err != nil {
		t.Errorf("Err -> \nWant: <nil> \nGot: %q", err)
	}
	refreshToken := out.RefreshToken

	tests := map[string]struct {
		in       *pb.RefreshTokenRequest
		expected expectation
	}{
		"Must_Success": {
			in: &pb.RefreshTokenRequest{
				RefreshToken: refreshToken,
			},
			expected: expectation{
				out: &pb.DefaultAuthResponse{
					User: &pb.User{
						Username: "admin",
						Role: *pb.Role_ADMIN.Enum(),
					},
				},
				err: nil,
			},
		},
		"Invalid_Token": {
			in: &pb.RefreshTokenRequest{
				RefreshToken: "invalid",
			},
			expected: expectation{
				out: &pb.DefaultAuthResponse{},
				err: errors.New("rpc error: code = InvalidArgument desc = Invalid refresh token"),
			},
		},
		"Empty_Token": {
			in: &pb.RefreshTokenRequest{
				RefreshToken: "",
			},
			expected: expectation{
				out: &pb.DefaultAuthResponse{},
				err: errors.New("rpc error: code = InvalidArgument desc = Invalid refresh token"),
			},
		},
	}

	for scenario, tt := range tests {
		t.Run("RefreshToken/" + scenario, func(t *testing.T) {
			out, err := client.RefreshToken(ctx, tt.in)
			if err != nil {
				if(tt.expected.err == nil){
					t.Errorf("Err -> \nWant: <nil> \nGot: %q", err)
				}
				if tt.expected.err.Error() != err.Error() {
					t.Errorf("Err -> \nWant: %q\nGot: %q\n", tt.expected.err, err)
				}else {
					if tt.expected.out.AccessToken != "" || tt.expected.out.RefreshToken != "" {
						t.Errorf("Tokens -> \nWant: <empty>\nGot: %q\n", out)
					}
				}
			} else {
				if tt.expected.out.User.Username != out.User.Username ||
					tt.expected.out.User.Role != out.User.Role {
					t.Errorf("Out -> \nWant: %q\nGot : %q", tt.expected.out, out)
				
				// Check tokens
				if tt.expected.out.AccessToken == "" || tt.expected.out.RefreshToken == "" {
					t.Errorf("Tokens -> \nWant: <not empty>\nGot: %q\n", out)
				}

			}

		}
	})
	}
}

func logout(t *testing.T, ctx context.Context, client pb.AuthServiceClient){
	type expectation struct {
		out *pb.LogoutResponse
		err error
	}
	// First login to get refresh token
	out, err := client.Login(ctx, &pb.LoginRequest{
		Username: "admin",
		Password: "Admin123",
	})
	if err != nil {
		t.Errorf("Err -> \nWant: <nil> \nGot: %q", err)
	}
	refreshToken := out.RefreshToken

	tests := map[string]struct {
		in       *pb.LogoutRequest
		expected expectation
	}{
		"Must_Success": {
			in: &pb.LogoutRequest{
				RefreshToken: refreshToken,
			},
			expected: expectation{
				out: &pb.LogoutResponse{
					Success: true,
				},
				err: nil,
			},
		},
		"Invalid_Token": {
			in: &pb.LogoutRequest{
				RefreshToken: "invalid",
			},
			expected: expectation{
				out: nil,
				err: errors.New("rpc error: code = InvalidArgument desc = Invalid refresh token"),
			},
		},
		"Empty_Token": {
			in: &pb.LogoutRequest{
				RefreshToken: "",
			},
			expected: expectation{
				out: nil,
				err: errors.New("rpc error: code = InvalidArgument desc = Invalid refresh token"),
			},
		},
	}

	for scenario, tt := range tests {
		t.Run("Logout/" + scenario, func(t *testing.T) {
			out, err := client.Logout(ctx, tt.in)
			if err != nil {
				if(tt.expected.err == nil){
					t.Errorf("Err -> \nWant: <nil> \nGot: %q", err)
				}
				if tt.expected.err.Error() != err.Error() {
					t.Errorf("Err -> \nWant: %q\nGot: %q\n", tt.expected.err, err)
				}
			} else {
				if tt.expected.out.Success != out.Success {
					t.Errorf("Out -> \nWant: %q\nGot : %q", tt.expected.out, out)
				}
			}

		},
		)

	}
}

func status(t *testing.T, ctx context.Context, client pb.AuthServiceClient){
	type expectation struct {
		out *pb.StatusResponse
		err error
	}
	// First login to get refresh token
	out, err := client.Login(ctx, &pb.LoginRequest{
		Username: "admin",
		Password: "Admin123",
	})
	if err != nil {
		t.Errorf("Err -> \nWant: <nil> \nGot: %q", err)
	}
	metadataForStatus := metadata.New(map[string]string{"authorization": out.AccessToken})
	ctxOut := metadata.NewOutgoingContext(ctx, metadataForStatus)
	metadataWrong := metadata.New(map[string]string{"authorization": "wrong"})
	ctxWrong := metadata.NewOutgoingContext(ctx, metadataWrong)

	// ctx = metadata.NewOutgoingContext(ctx, metadata)

	tests := map[string]struct {
		ctxOut context.Context
		in       *pb.StatusRequest
		expected expectation
	}{
		"Must_Success": {
			ctxOut: ctxOut, 
			in: &pb.StatusRequest{},
			expected: expectation{
				out: &pb.StatusResponse{
					User: &pb.User{
						Username: "admin",
					},
				},
				err: nil,
			},
		},
		"Invalid_Token": {
			ctxOut: ctxWrong,
			in: &pb.StatusRequest{},
			expected: expectation{
				out: nil,
				err: errors.New("rpc error: code = Unauthenticated desc = Invalid token"),
			},
		},
	}
	for scenario, tt := range tests {
		t.Run("Status/" + scenario, func(t *testing.T) {
			out, err := client.Status(tt.ctxOut, tt.in)
			if err != nil {
				if(tt.expected.err == nil){
					t.Errorf("Err -> \nWant: <nil> \nGot: %q", err)
				}
				if tt.expected.err.Error() != err.Error() {
					t.Errorf("Err -> \nWant: %q\nGot: %q\n", tt.expected.err, err)
				}
			} else {
				if tt.expected.out.User.Username != out.User.Username {
					t.Errorf("Out -> \nWant: %q\nGot : %q", tt.expected.out, out)
				}
			}
		},
		)

	}
}

			
	// for scenario, tt := range tests {
	// 	t.Run("Status/" + scenario, func(t *testing.T) {
	// 		out, err := client.Status(ctxOut, tt.in)
	// 		if err != nil {
	// 			if(tt.expected.err == nil){
	// 				t.Errorf("Err -> \nWant: <nil> \nGot: %q", err)
	// 			}
	// 			if tt.expected.err.Error() != err.Error() {
	// 				t.Errorf("Err -> \nWant: %q\nGot: %q\n", tt.expected.err, err)
	// 			}
	// 		} else {
	// 			if tt.expected.out.User.Username != out.User.Username {
	// 				t.Errorf("Out -> \nWant: %q\nGot : %q", tt.expected.out, out)
	// 			}

	// 		}

	// 	},
	// 	)

	// }
// }

func totp(t *testing.T, ctx context.Context, client pb.AuthServiceClient){
	type expectation struct {
		out *pb.EnableTOTPResponse
		err error
	}
	// First login to get refresh token
	out, err := client.Login(ctx, &pb.LoginRequest{
		Username: "admin",
		Password: "Admin123",
	})
	if err != nil {
		t.Errorf("Err -> \nWant: <nil> \nGot: %q", err)
	}
	metadataForAuth := metadata.New(map[string]string{"authorization": out.AccessToken})
	ctxOut := metadata.NewOutgoingContext(ctx, metadataForAuth)
	metadataWrong := metadata.New(map[string]string{"authorization": "wrong"})
	ctxWrong := metadata.NewOutgoingContext(ctx, metadataWrong)

	var totpSecret string
	
	tests := map[string]struct {
		ctxOut *context.Context
		in       *pb.EnableTOTPRequest
		expected expectation
	}{
		"Must_Success": {
			ctxOut: &ctxOut,
			in: &pb.EnableTOTPRequest{
				Password: "Admin123",
			},
			expected: expectation{
				out: &pb.EnableTOTPResponse{
					Secret: "secretDummy",
					Url: "urlDummy",
				},
				err: nil,
			},
		},
		"Invalid_Token": {
			ctxOut: &ctxWrong,
			in: &pb.EnableTOTPRequest{
				Password: "Admin123",
			},
			expected: expectation{
				out: nil,
				err: errors.New("rpc error: code = Unauthenticated desc = Invalid token"),
			},
		},
	}
	for scenario, tt := range tests {
		t.Run("TOTP/" + scenario, func(t *testing.T) {
			out, err := client.EnableTOTP(*tt.ctxOut, tt.in)
			if err != nil {
				if(tt.expected.err == nil){
					t.Errorf("Err -> \nWant: <nil> \nGot: %q", err)
				}
				if tt.expected.err.Error() != err.Error() {
					t.Errorf("Err -> \nWant: %q\nGot: %q\n", tt.expected.err, err)
				}
			} else {
				// print out
				// t.Logf("Out -> \nWant: %q\nGot : %q", tt.expected.out, out)
				if (tt.expected.out.Secret == "secretDummy" && out.Secret == "") || (tt.expected.out.Url == "urlDummy" && out.Url == "") {
					t.Errorf("Out -> \nWant: <ASecret> \nGot: %q \nWant: <AUrl> \nGot: %q", out.Secret, out.Url)
				}
				totpSecret = out.Secret
			}
		},
		)
	}
	totpCode, err := totpGen.GenerateCode(totpSecret, time.Now())
	if err != nil {
		t.Errorf("Err when generate totp code -> \nWant: <nil> \nGot: %q", err)
	}
	// Vertify TOTP
	t.Run("TOTP/Vertify", func(t *testing.T) {
		out, err := client.VerifyTOTP(ctxOut, &pb.VerifyTOTPRequest{
			TotpCode: totpCode,
		})
		if err != nil {
			t.Errorf("Err -> \nWant: <nil> \nGot: %q", err)
		} else {
			if out.Success != true {
				
				t.Errorf("Out -> \nWant: <true> \nGot: %q", out)

			}	

		}
	})
	totpCodeWrong := "123456"
	// Login with TOTP 
	t.Run("TOTP/Fail", func(t *testing.T) {
		out, err := client.Login(ctx, &pb.LoginRequest{
			Username: "admin",
			Password: "Admin123",
			TotpCode: &totpCodeWrong,
		})
		if err != nil {
			if err.Error() != "rpc error: code = Unauthenticated desc = TOTP code invalid" {
				t.Errorf("Err -> \nWant: 'rpc error: code = Unauthenticated desc = TOTP code invalid' \nGot: %q", err)
			}
		} else {
			t.Errorf("Err -> \nWant: <Invalid TOTP> \nGot: <nil> and out: %q", out)
		}
	})
	// Login with TOTP 
	out, err = client.Login(ctx, &pb.LoginRequest{
		Username: "admin",
		Password: "Admin123",
		TotpCode: &totpCode,
	})
	if err != nil {
		t.Errorf("Err -> \nWant: <nil> \nGot: %q", err)
	}
	metadataForAuth = metadata.New(map[string]string{"authorization": out.AccessToken})
	ctxOut = metadata.NewOutgoingContext(ctx, metadataForAuth)

	// Disable TOTP
	t.Run("TOTP/Disable/Fail", func(t *testing.T) {
		out, err := client.DisableTOTP(ctxWrong, &pb.DisableTOTPRequest{
			Password: "Admin123",
		})
		if err != nil {
			if err.Error() != "rpc error: code = Unauthenticated desc = Invalid token" {
				t.Errorf("Err -> \nWant: <Invalid token> \nGot: %q", err)
			}
		} else {
			t.Errorf("Err -> \nWant: <Invalid token> \nGot error: <nil> and out: %q", out)
		}
	})
	// Disable TOTP - Success
	totpCodeForDisable, err := totpGen.GenerateCode(totpSecret, time.Now())
	if err != nil {
		t.Errorf("Err when generate totp code -> \nWant: <nil> \nGot: %q", err)
	}
	t.Run("TOTP/Disable/Success", func(t *testing.T) {
		out, err := client.DisableTOTP(ctxOut, &pb.DisableTOTPRequest{
			Password: "Admin123",
			TotpCode: totpCodeForDisable,
		})
		if err != nil {
			t.Errorf("Err -> \nWant: <nil> \nGot: %q", err)
		} else {
			if out.Success != true {
				t.Errorf("Out -> \nWant: <true> \nGot: %q", out)
			}
		}
	})

}

