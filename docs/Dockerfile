FROM golang:1.19

# RUN apk --update add bash protoc protobuf-dev && rm -rf /var/cache/apk/*
RUN apt update && apt install -y bash protobuf-compiler
RUN go install github.com/pseudomuto/protoc-gen-doc/cmd/protoc-gen-doc@latest

VOLUME [ "/out" ]
VOLUME [ "/grpc-proto"]

COPY ./scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
WORKDIR /

ENTRYPOINT [ "/entrypoint.sh" ]