#!/bin/bash

protoc -I / \
	--doc_out=./out \
 	--doc_opt=html,index.html \
 	/grpc-proto/auth.proto \
	/grpc-proto/avatar.proto \
	--experimental_allow_proto3_optional