#!/bin/bash

protoc -I / \
	--doc_out=./out \
 	--doc_opt=markdown,docs.md \
 	/grpc-proto/auth.proto \
	/grpc-proto/avatar.proto \
	/grpc-proto/annotations.proto \
	/grpc-proto/http.proto \
	--experimental_allow_proto3_optional