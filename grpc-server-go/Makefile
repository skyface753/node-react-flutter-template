gen-proto:
	protoc --proto_path=../grpc-proto ../grpc-proto/*.proto --go_out=. --go-grpc_out=.

gen: gen-proto


proto-install:
	go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
	export PATH="$PATH:$(go env GOPATH)/bin"

go-install:
	go get github.com/go-redis/redis/v9
