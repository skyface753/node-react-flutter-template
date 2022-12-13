package s3

import (
	"context"
	"log"
	"template/server/helper/getenv"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	v4 "github.com/aws/aws-sdk-go-v2/aws/signer/v4"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)



var (
	Bucket string
	KeyPrefix string // KeyPrefix is the prefix for the S3 keys (Folder)
	Client *s3.Client
	preSignClient *s3.PresignClient
	EndPoint string
)



func NewClient() {
	Bucket = getenv.GetEnv("S3_BUCKET", "bucket")
	KeyPrefix = getenv.GetEnv("S3_KEY_PREFIX", "avatars/")
	EndPoint = getenv.GetEnv("S3_ENDPOINT", "http://localhost:9000")
	Username := getenv.GetEnv("S3_USERNAME", "minio-root-user")
	Password := getenv.GetEnv("S3_PASSWORD", "minio-root-password")
	Client = s3.NewFromConfig(aws.Config{
		Credentials: credentials.NewStaticCredentialsProvider(Username, Password, ""),
		Region:      "us-east-1",
		EndpointResolver: aws.EndpointResolverFunc(func(service, region string) (aws.Endpoint, error) {
			return aws.Endpoint{
				PartitionID:       "aws",
				URL: 			 EndPoint,
				SigningRegion:     "us-east-1",
				HostnameImmutable: true,
			}, nil
		}),
	})
	preSignClient = s3.NewPresignClient(Client)
}

func  PresignedPut(key string) (*string, *string, error) {
	fullKey := aws.String(KeyPrefix + key)
	request, err := preSignClient.PresignPutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(Bucket),
		Key:    fullKey,
		
	}, func(opts *s3.PresignOptions) {
		opts.Expires = time.Duration(24 * time.Hour)
	})
	if err != nil {
		log.Printf("Couldn't get a presigned request to put %v:%v. Here's why: %v\n",
			Bucket, *fullKey, err)
		return nil, nil, err
	}
	// TODO: HOST

	return &request.URL, fullKey, nil

}

func PresignedGet(key string) (*v4.PresignedHTTPRequest, error) {
	request, err := preSignClient.PresignGetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String(Bucket),
		Key:    aws.String(key), // Note: this is the full key, dont add KeyPrefix (it's already in the key)
	}, func(opts *s3.PresignOptions) {
		opts.Expires = time.Duration(24 * time.Hour)
	})
	if err != nil {
		log.Printf("Couldn't get a presigned request to get %v:%v. Here's why: %v\n",
			Bucket, key, err)
		return nil, err
	}

	return request, nil
}


//Client is the s3 client
// var Client *s3.Client

// // NewClient creates a new S3 client.
// func NewClient() {
// 	const defaultRegion = "us-east-1"
// staticResolver := aws.EndpointResolverFunc(func(service, region string) (aws.Endpoint, error) {
//     return aws.Endpoint{
//         PartitionID:       "aws",
//         URL:               "http://localhost:9000", // or where ever you ran minio
//         SigningRegion:     defaultRegion,
//         HostnameImmutable: true,
//     }, nil
// })

// cfg := aws.Config{
//     Region:           defaultRegion,
//     Credentials:      credentials.NewStaticCredentialsProvider("minio-root-user", "minio-root-password", ""),
//     EndpointResolver: staticResolver,
// }

// Client = s3.NewFromConfig(cfg)
// }

// // PresignedPut returns a presigned URL for the given object key.
// func PresignedPutURL(key string) (*v4.PresignedHTTPRequest, *string, error) {
// 	preClient := s3.NewPresignClient(Client)
// 	request, err := preClient.PresignPutObject(context.Background(), &s3.PutObjectInput{
// 		Bucket: aws.String(Bucket),
// 		Key:    aws.String(KeyPrefix + key),
// 		Expires: aws.Time(time.Now().Add(24 * time.Hour)),
// 	})
// 	if err != nil {
// 		log.Fatalln(err)
// 	}
// 	return request, aws.String(KeyPrefix + key), nil

// }

// // PresignedGet returns a presigned URL for the given object key.
// func PresignedGetURL(key string) (*v4.PresignedHTTPRequest, error) {
// 	preClient := s3.NewPresignClient(Client)
// 	request, err := preClient.PresignGetObject(context.Background(), &s3.GetObjectInput{
// 		Bucket: aws.String(Bucket),
// 		Key:    aws.String(key),
// 		ResponseExpires: aws.Time(time.Now().Add(24 * time.Hour)),
// 	})
// 	if err != nil {
// 		log.Fatalln(err)
// 	}
// 	return request, nil

// }
