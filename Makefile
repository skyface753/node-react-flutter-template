PROJECT = "Template Project"
NAME = "template"

# GRPC Definitions
grpcClientDir = "grpc-client-reactjs"
grpcServerDir = "grpc-server-nodejs"

# HTTP Definitions
httpClientDir = "http-client-reactjs"
httpServerDir = "http-server-nodejs"

# Docker Definitions
dockerUser = "skyface753"

# Install dependencies
install:
	@echo "Installing dependencies..."
	@cd $(grpcClientDir) && npm install
	@cd $(grpcServerDir) && npm install
	@cd $(httpClientDir) && npm install
	@cd $(httpServerDir) && npm install

# Build frontend Docker
build-frontend:
	@echo "Building frontend Docker..."
	@cd $(grpcClientDir) && docker build -t $(dockerUser)/$(NAME)-grpc-client:latest .
	@cd $(httpClientDir) && docker build -t $(dockerUser)/$(NAME)-http-client:latest .

# Build backend Docker
build-backend:
	@echo "Building backend Docker..."
	@cd $(grpcServerDir) && docker build -t $(dockerUser)/$(NAME)-grpc-server:latest .
	@cd $(httpServerDir) && docker build -t $(dockerUser)/$(NAME)-http-server:latest .

# Build all Docker
build: build-frontend build-backend

gen-gateway:
	protoc -I ./grpc-proto --grpc-gateway_out ./gateway/gen/template \
    --grpc-gateway_opt logtostderr=true \
    --grpc-gateway_opt paths=source_relative \
    --grpc-gateway_opt generate_unbound_methods=true \
    ./grpc-proto/*.proto

gen-gateway-proto:
	protoc --proto_path=./grpc-proto ./grpc-proto/*.proto --go_out=./gateway/gen/template --go-grpc_out=./gateway/gen/template \
	--go_opt paths=source_relative \
	--go-grpc_opt paths=source_relative

gen-swagger:
	protoc -I ./grpc-proto --openapiv2_out ./openapiv2 \
    --openapiv2_opt logtostderr=true \
    ./grpc-proto/*.proto
