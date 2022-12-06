package s3

import (
	"context"
	"log"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

const (
	endpoint = "localhost:9000"
	accessKey = "minio-root-user"
	secretKey = "minio-root-password"
)

var (
	// Client is the s3 client
	Client *minio.Client
)

// NewClient creates a new S3 client.
func NewClient() {
	// Initialize minio client object.



	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: false,
	})
	if err != nil {
		log.Fatalln(err)
	}
	// Check if the bucket exists.
	exists, err := minioClient.BucketExists(context.Background(), Bucket)
	if err != nil {
		log.Fatalln(err)
	}
	if !exists {
		// Create the bucket
		err = minioClient.MakeBucket(context.Background(), Bucket, minio.MakeBucketOptions{Region: "us-east-1"})
		if err != nil {
			log.Fatalln(err)
		}
	}
	
	
	Client = minioClient
}



