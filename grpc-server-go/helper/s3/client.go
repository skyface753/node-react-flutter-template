package s3

import (
	"context"
	"errors"
	"log"
	"template/server/helper/envget"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	v4 "github.com/aws/aws-sdk-go-v2/aws/signer/v4"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
)



var (
	Bucket string
	KeyPrefix string // KeyPrefix is the prefix for the S3 keys (Folder)
	Client *s3.Client
	preSignClient *s3.PresignClient
	EndPoint string
)



func NewClient() {
	Bucket = envget.GetEnv("S3_BUCKET", "bucket")
	KeyPrefix = envget.GetEnv("S3_KEY_PREFIX", "avatars/")
	EndPoint = envget.GetEnv("S3_ENDPOINT", "http://localhost:9000")
	Username := envget.GetEnv("S3_USERNAME", "minio-root-user")
	Password := envget.GetEnv("S3_PASSWORD", "minio-root-password")
	Client = s3.NewFromConfig(aws.Config{
		Credentials: credentials.NewStaticCredentialsProvider(Username, Password, ""),
		Region:      "us-east-1",
			EndpointResolverWithOptions: aws.EndpointResolverWithOptionsFunc(aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
				return aws.Endpoint{
					PartitionID:       "aws",
					URL: 			 EndPoint,
					SigningRegion:     "us-east-1",
					HostnameImmutable: true,
					}, nil
				})),
	})
	
	
	createBucketIfNotExists()
	preSignClient = s3.NewPresignClient(Client)
}

func createBucketIfNotExists() error {
	_, err := Client.CreateBucket(context.TODO(), &s3.CreateBucketInput{
		Bucket: aws.String(Bucket),
		// CreateBucketConfiguration: &types.CreateBucketConfiguration{
		// 	LocationConstraint: types.BucketLocationConstraint("us-east-1"),
		// },
	})
	if err != nil {
		if errors.Is(err, &types.BucketAlreadyExists{}) || errors.Is(err, &types.BucketAlreadyOwnedByYou{}) {
			// log.Printf("Bucket %v already exists. Continuing.\n", Bucket)
			return nil
		}
		// log.Printf("Couldn't create bucket %v. Here's why: %v\n", Bucket, err)
		return err
	}
	// log.Printf("Created bucket %v. Here's the response: %v\n", Bucket, res)
	return nil


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

func Get(key string) (*s3.GetObjectOutput, error) {
	return Client.GetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String(Bucket),
		Key:    aws.String(key),
	})
}

func Exists(key string) (bool, error) {
	_, err := Client.HeadObject(context.TODO(), &s3.HeadObjectInput{
		Bucket: aws.String(Bucket),
		Key:    aws.String(key),
	})
	if err != nil {
		var nsk *types.NoSuchKey
		if !errors.As(err, &nsk) {
			return false, err
		}
		return false, nil
		

	}
	return true, nil
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
