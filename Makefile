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

docker-backup:
	mkdir -p ./db-backup
	docker-compose -f docker-compose-grpc-debug.yaml exec -T primary pg_dumpall -c -U testuser > ./db-data/backup/dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql

docker-restore:
	cat ./db-data/cleanInit.sql | docker-compose -f docker-compose-grpc-debug.yaml exec -T primary psql -U testuser -d testdb