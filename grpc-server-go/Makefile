
gen-proto:
	protoc -I ../ \
	--go_out ./ --go_opt paths=source_relative \
	--go-grpc_out ./ --go-grpc_opt paths=source_relative \
	../grpc-proto/auth.proto \
	../grpc-proto/avatar.proto \
	../grpc-proto/annotations.proto \
	../grpc-proto/http.proto

test-unit:
	go test -short ./... -count=1

test-integration:
	go test -tags=integration ./... -count=1

test-bench:
	go test -bench=. ./...

test-verbose:
	go test -v ./...

test: test-unit test-integration test-bench

test-coverage:
	go test -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out

gen-certs:
	cd cert; sh ./gen.sh

test-load:
	ghz --insecure --total=200 --call template.AuthService.Login -d '{"username":"user","password":"User123"}' localhost:50051


pprof:
	go tool pprof http://localhost:8024/debug/pprof/profile\?seconds\=10

pprof-visual:
	pprof -http=localhost:8025 {server_binary} {file_path}.pb.gz
