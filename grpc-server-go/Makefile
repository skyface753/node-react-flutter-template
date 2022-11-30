gen-proto:
	protoc --proto_path=../grpc-proto ../grpc-proto/*.proto --go_out=. --go-grpc_out=.

prisma-pull:
	go run github.com/prisma/prisma-client-go db pull

prisma-generate:
	go run github.com/prisma/prisma-client-go generate

gen-prisma: prisma-pull prisma-generate

proto-install:
	go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
	export PATH="$PATH:$(go env GOPATH)/bin"


gen: gen-proto gen-prisma
