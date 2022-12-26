package main

import (
	"context"
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/golang/glog"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	// helloworldpb "github.com/myuser/myrepo/proto/helloworld"
	gw "gateway/proxy/pb/template"
)

var (
  // command-line options:
  // gRPC server endpoint
  // grpcServerEndpoint = flag.String("grpc-server-endpoint",  "localhost:50051", "gRPC server endpoint")
)

func run() error {
  ctx := context.Background()
  ctx, cancel := context.WithCancel(ctx)
  defer cancel()

  // Register gRPC server endpoint
  // Note: Make sure the gRPC server is running properly and accessible
  mux := runtime.NewServeMux()
  opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}

  var grpcServerEndpoint = flag.String("grpc-server-endpoint",  os.Getenv("SERVER_ENDPOINT"), "gRPC server endpoint")
  if *grpcServerEndpoint == "" {
    *grpcServerEndpoint = "localhost:50051"
  }
  

  err := gw.RegisterAuthServiceHandlerFromEndpoint(ctx, mux,  *grpcServerEndpoint, opts)
  if err != nil {
    return err
  }
  err = gw.RegisterAvatarServiceHandlerFromEndpoint(ctx, mux,  *grpcServerEndpoint, opts)
  if err != nil {
    return err
  }
  log.Println("Starting HTTP/1.1 REST server on :8081")
  // Start HTTP server (and proxy calls to gRPC server endpoint)
  return http.ListenAndServe(":8081", mux)
  
}

func main() {
  flag.Parse()
  defer glog.Flush()

  if err := run(); err != nil {
    glog.Fatal(err)
  }
}