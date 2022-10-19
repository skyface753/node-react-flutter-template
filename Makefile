PROJECT = "Template Project"
NAME = "template"
clientFolder = "client-reactjs"
serverFolder = "server-nodejs"


install-depenencies:
	@echo "Installing dependencies..."
	@cd $(clientFolder) && npm install
	@cd $(serverFolder) && npm install

build-frontend:
	@echo "Building frontend..."
	@cd $(clientFolder) && docker build -t skyface753/$(NAME)-frontend:latest .


build-backend:
	@echo "Building backend..."
	@cd $(serverFolder) && docker build -t skyface753/$(NAME)-backend:latest .

docker-up:
	@echo "Starting docker containers..."
	@docker-compose up -d --build --remove-orphans

build: build-frontend build-backend docker-up