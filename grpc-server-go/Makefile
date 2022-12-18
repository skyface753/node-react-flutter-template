
gen-proto:
	protoc -I ../ \
	--go_out ./ --go_opt paths=source_relative \
	--go-grpc_out ./ --go-grpc_opt paths=source_relative \
	../grpc-proto/auth.proto \
	../grpc-proto/avatar.proto \

test-unit:
	go test -short ./... -count=1

test-integration:
	go test -tags=integration ./... -count=1

test-bench:
	go test -bench=. ./...

test: test-unit test-integration
# 	go test -tags=unit_tests ./...

# test-integration:
# 	go test -tags=integration ./...

# test: test-unit test-integration

test-verbose:
	go test -v ./...

gen-certs:
	cd cert; sh ./gen.sh