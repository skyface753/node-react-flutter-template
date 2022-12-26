gatewayOut = "."
gen-gateway:
	protoc -I ../ \
	--go_out $(gatewayOut) --go_opt paths=import \
	--go-grpc_out $(gatewayOut) --go-grpc_opt paths=import \
	--grpc-gateway_out $(gatewayOut) --grpc-gateway_opt paths=import \
	../grpc-proto/auth.proto \
	../grpc-proto/avatar.proto \
	../grpc-proto/annotations.proto \
	../grpc-proto/http.proto \

