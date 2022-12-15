FROM golang:1.19

WORKDIR /usr/src/app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .

# Set env
ENV PROD=TRUE

RUN go build -o /usr/local/bin/app
EXPOSE 50051
CMD ["/usr/local/bin/app"]