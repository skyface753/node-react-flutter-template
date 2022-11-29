gen-proto:
	protoc --proto_path=../grpc-proto ../grpc-proto/*.proto --go_out=. --go-grpc_out=.

prisma-pull:
	go run github.com/prisma/prisma-client-go db pull

prisma-generate:
	go run github.com/prisma/prisma-client-go generate

gen-prisma: prisma-pull prisma-generate

gen: gen-proto gen-prisma
