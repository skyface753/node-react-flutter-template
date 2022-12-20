package main

import (
	"crypto/tls"
	"log"
	"net"
	pb "template/server/grpc-proto"
	db "template/server/helper/db"
	"template/server/helper/envget"

	services "template/server/services"

	"template/server/helper/redis"

	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/reflection"

	"template/server/helper/s3"
)

var (
	port = ":50051"
)

func main() {
	godotenv.Load()

	prod := envget.GetEnv("PROD", "FALSE")
	if prod != "TRUE" {
		port = "localhost" + port
	}

	listener, err := net.Listen("tcp", port)
	if err != nil {
		panic(err)
	}
	log.Printf("Server listening on port %v with PROD=%v", port, prod)	
	
	db.InitDB()
	redis.InitRedis()
	defer db.CloseDB()
	s3.NewClient()

	
	var s *grpc.Server

	if envget.GetEnv("TLS", "FALSE") == "TRUE" || envget.GetEnv("TLS", "FALSE") == "true" {
		tlsCredentials, err := loadTLSCredentials()
		if err != nil {
		    log.Fatal("cannot load TLS credentials: ", err)
		}
		s = grpc.NewServer(
		    grpc.Creds(tlsCredentials),
		)
	} else {
		s = grpc.NewServer()
	}
	

	reflection.Register(s)
	pb.RegisterAuthServiceServer(s, &services.AuthServer{})
	pb.RegisterAvatarServiceServer(s, &services.AvatarServer{})
	if err := s.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

func loadTLSCredentials() (credentials.TransportCredentials, error) {
    // Load server's certificate and private key
    serverCert, err := tls.LoadX509KeyPair("cert/server-cert.pem", "cert/server-key.pem")
    if err != nil {
        return nil, err
    }

    // Create the credentials and return it
    config := &tls.Config{
        Certificates: []tls.Certificate{serverCert},
        ClientAuth:   tls.NoClientCert,
    }

    return credentials.NewTLS(config), nil
}


