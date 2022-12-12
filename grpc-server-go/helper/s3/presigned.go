package s3

// import (
// 	"context"
// 	"net/url"
// 	"template/server/helper/generators"
// 	"time"
// )
// const (
// 	// Bucket is the name of the S3 bucket.
// 	Bucket = "bucket"
// 	KeyPrefix = "avatars/" // KeyPrefix is the prefix for the S3 keys (Folder)

// )

// // SignedPutURL returns a signed URL for uploading an object to S3.
// func  SignedPutURL(key string) (*url.URL, *string, error) {
// 	reqParams := make(url.Values)
// 	reqParams.Set("response-content-type", "image/jpeg")
// 	fileKey := KeyPrefix + generators.GetRandomString(5) + "-" + key

// 	presignedURL, err := Client.PresignedPutObject(context.Background(), Bucket, fileKey, 24 * time.Hour)
// 	if err != nil {
// 		return nil, nil, err
// 	}
// 	// presignedURL.Host = publicHost
// 	return presignedURL, &fileKey, nil
// }

// func SignedGetURL(key string) (*url.URL, error) {
// 	values := make(url.Values)
// 	values.Set("response-content-type", "image/jpeg")
// 	presignedURL, err := Client.PresignedGetObject(context.Background(), Bucket, key, 24 * time.Hour, values)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return presignedURL, nil
// }