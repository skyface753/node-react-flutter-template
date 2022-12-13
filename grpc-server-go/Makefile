
# gen-proto:
# 	protoc -I ../ \
# 	--proto_path=../grpc-proto \
# 	--go_out=. \
# 	--go-grpc_out=. \
# 	../grpc-proto/*.proto \

gen-proto:
	protoc -I ../ \
	--go_out ./ --go_opt paths=source_relative \
	--go-grpc_out ./ --go-grpc_opt paths=source_relative \
	../grpc-proto/auth.proto \
	../grpc-proto/avatar.proto \

test:
	go test ./...

test-verbose:
	go test -v ./...
