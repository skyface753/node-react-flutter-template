import chai from 'chai';
import { describe } from 'mocha';
import { expect } from 'chai';
import fs from 'fs';
import client, { avatarClient } from './client';
import {
  GetAvatarViewRequest,
  GetAvatarViewResponse,
  UploadConfirmRequest,
  UploadConfirmResponse,
  UploadGetUrlRequest,
  UploadGetUrlResponse,
  // ImageInfo,
  // UploadImageRequest,
  // UploadImageResponse,
  // UploadUrlRequest,
  // UploadUrlResponse,
} from '../proto/grpc-proto/avatar_pb';
import { Metadata, ServiceError, status } from '@grpc/grpc-js';
import { DefaultAuthResponse, LoginRequest } from '../proto/grpc-proto/auth_pb';
import fetch from 'node-fetch';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
chai.should();
import crypto from 'crypto';

describe('AvatarService', () => {
  const metadata = new Metadata();
  let userId: number;
  before((done) => {
    const loginRequest = new LoginRequest();
    loginRequest.setUsername('user');
    loginRequest.setPassword('User123');
    client.login(
      loginRequest,
      (err: ServiceError | null, res: DefaultAuthResponse) => {
        if (err) {
          throw err;
        }
        expect(res.getUser()?.getUsername()).to.equal('user');
        metadata.add('authorization', res.getAccessToken());
        userId = res.getUser()?.getId() || 0;
        done();
      }
    );
  });
  let uploadToken: string;
  it('should get upload URL', (done) => {
    const uploadGetRequest = new UploadGetUrlRequest();
    uploadGetRequest.setFilename('avatar.png');
    avatarClient.getUploadURL(
      uploadGetRequest,
      metadata,
      (err: ServiceError | null, res: UploadGetUrlResponse) => {
        if (err) {
          throw err;
        }
        expect(res.getUrl()).to.be.a('string');
        expect(res.getTokentoconfirm()).to.be.a('string');
        uploadToken = res.getTokentoconfirm();
        console.log('UPLOAD URL' + res.getUrl());
        fetch(res.getUrl(), {
          method: 'PUT',
          body: fs.readFileSync('./src/test/avatar.png'),
          headers: {
            'Content-Type': 'image/png',
          },
        }).then((res) => {
          console.log('UPLOAD STATUS: ' + res.status);
          expect(res.status).to.equal(200);
          done();
        });
      }
    );
  });
  it('should error when getting upload URL without metadata', (done) => {
    const uploadGetRequest = new UploadGetUrlRequest();
    uploadGetRequest.setFilename('avatar.png');
    avatarClient.getUploadURL(uploadGetRequest, (err: ServiceError | null) => {
      expect(err?.code).to.equal(status.UNAUTHENTICATED);
      if (!err) {
        throw new Error('Should have errored');
      }
      done();
    });
  });
  it('should confirm the upload', (done) => {
    const uploadConfirmRequest = new UploadConfirmRequest();
    uploadConfirmRequest.setToken(uploadToken);
    avatarClient.confirmUpload(
      uploadConfirmRequest,
      metadata,
      (err: ServiceError | null, res: UploadConfirmResponse) => {
        if (err) {
          throw err;
        }
        expect(res.getUrl()).to.be.a('string');
        done();
      }
    );
  });

  it('should get avatar of user', (done) => {
    const getAvatarViewRequest = new GetAvatarViewRequest();
    getAvatarViewRequest.setUserid(userId);
    avatarClient.getAvatarView(
      getAvatarViewRequest,
      (err: ServiceError | null, res: GetAvatarViewResponse) => {
        if (err) {
          throw err;
        }
        expect(res.getUrl()).to.be.a('string');
        // Download avatar.png from the URL
        fetch(res.getUrl())
          .then((res) => {
            console.log('DOWNLOAD STATUS: ' + res.status);
            console.log(res);
            expect(res.status).to.equal(200);
            return res.buffer();
          })
          .then((buffer) => {
            const hash = crypto.createHash('sha256');
            hash.update(buffer);
            const hashString = hash.digest('hex');
            const expectedHash = crypto
              .createHash('sha256')
              .update(fs.readFileSync('./src/test/avatar.png'))
              .digest('hex');
            expect(hashString).to.equal(expectedHash);
            done();
          })
          .catch((err) => {
            throw err;
          });
      }
    );
  });

  //   const uploadUrlRequest = new UploadUrlRequest();
  //   uploadUrlRequest.setFilename('test.jpg');
  //   avatarClient.requestAUploadURL(
  //     uploadUrlRequest,
  //     metadata,
  //     (err: ServiceError | null, res: UploadUrlResponse) => {
  //       if (err) {
  //         throw err;
  //       }
  //       expect(res.getUrl()).to.be.a('string');
  //       console.log('UPLOAD URL' + res.getUrl());
  //       // Upload avatar.png to the URL
  //       fetch(res.getUrl(), {
  //         method: 'PUT',
  //         body: fs.readFileSync('./src/test/avatar.png'),
  //         headers: {
  //           'Content-Type': 'image/png',
  //         },
  //       })
  //         .then((res) => {
  //           console.log('UPLOAD STATUS: ' + res.status);
  //           expect(res.status).to.equal(200);
  //           done();
  //         })
  //         .catch((err) => {
  //           throw err;
  //         });
  //     }
  //   );
  // });
  // it('should error when getting upload URL without metadata', (done) => {
  //   const uploadUrlRequest = new UploadUrlRequest();
  //   uploadUrlRequest.setFilename('test.jpg');
  //   avatarClient.requestAUploadURL(
  //     uploadUrlRequest,
  //     (err: ServiceError | null) => {
  //       expect(err?.code).to.equal(status.UNAUTHENTICATED);
  //       if (!err) {
  //         throw new Error('Should have errored');
  //       }
  //       done();
  //     }
  //   );
  // });
  // it('should get avatar of user', (done) => {
  //   const getAvatarViewRequest = new GetAvatarViewRequest();
  //   getAvatarViewRequest.setUserid(userId);
  //   avatarClient.getAvatarView(
  //     getAvatarViewRequest,
  //     (err: ServiceError | null, res: GetAvatarViewResponse) => {
  //       if (err) {
  //         throw err;
  //       }
  //       expect(res.getUrl()).to.be.a('string');
  //       // Download avatar.png from the URL
  //       fetch(res.getUrl(), {
  //         method: 'GET',
  //       })
  //         .then((res) => {
  //           expect(res.status).to.equal(200);
  //           // Compare the downloaded avatar with the uploaded avatar
  //           const file = fs.createWriteStream(
  //             './src/test/avatar-downloaded.png'
  //           );
  //           res.body.pipe(file);
  //           file.on('finish', () => {
  //             file.close();
  //             const hashFile = crypto
  //               .createHash('sha256')
  //               .update(fs.readFileSync('./src/test/avatar.png'))
  //               .digest('hex');
  //             const hashDownloadedFile = crypto
  //               .createHash('sha256')
  //               .update(fs.readFileSync('./src/test/avatar-downloaded.png'))
  //               .digest('hex');
  //             expect(hashFile).to.equal(hashDownloadedFile);
  //             // console.log(hashFile);
  //             // Delete the downloaded avatar
  //             fs.unlinkSync('./src/test/avatar-downloaded.png');

  //             done();
  //           });
  //           file.on('error', (err) => {
  //             throw err;
  //           });
  //         })
  //         .catch((err) => {
  //           throw err;
  //         });
  //     }
  //   );
  // }).timeout(5000);
  // it('should get the correct avatr on login', (done) => {
  //   const loginRequest = new LoginRequest();
  //   loginRequest.setUsername('user');
  //   loginRequest.setPassword('User123');
  //   client.login(
  //     loginRequest,
  //     (err: ServiceError | null, res: DefaultAuthResponse) => {
  //       if (err) {
  //         throw err;
  //       }
  //       expect(res.getUser()?.getUsername()).to.equal('user');
  //       expect(res.getUser()?.getAvatar()).to.be.a('string');
  //       // Download avatar.png from the URL
  //       fetch(res.getUser()?.getAvatar() || '', {
  //         method: 'GET',
  //       })
  //         .then((res) => {
  //           expect(res.status).to.equal(200);
  //           // Compare the downloaded avatar with the uploaded avatar
  //           const file = fs.createWriteStream(
  //             './src/test/avatar-downloaded.png'
  //           );
  //           res.body.pipe(file);
  //           file.on('finish', () => {
  //             file.close();
  //             const hashFile = crypto
  //               .createHash('sha256')
  //               .update(fs.readFileSync('./src/test/avatar.png'))
  //               .digest('hex');
  //             const hashDownloadedFile = crypto
  //               .createHash('sha256')
  //               .update(fs.readFileSync('./src/test/avatar-downloaded.png'))
  //               .digest('hex');
  //             expect(hashFile).to.equal(hashDownloadedFile);
  //             // console.log(hashFile);
  //             // Delete the downloaded avatar
  //             fs.unlinkSync('./src/test/avatar-downloaded.png');

  //             done();
  //           });
  //           file.on('error', (err) => {
  //             throw err;
  //           });
  //         })
  //         .catch((err) => {
  //           throw err;
  //         });
  //     }
  //   );
  // }).timeout(5000);
  // it('should error when getting avatar of user that does not exist', (done) => {
  //   const getAvatarViewRequest = new GetAvatarViewRequest();
  //   getAvatarViewRequest.setUserid(999999);
  //   avatarClient.getAvatarView(
  //     getAvatarViewRequest,
  //     (err: ServiceError | null) => {
  //       expect(err?.code).to.equal(status.NOT_FOUND);
  //       if (!err) {
  //         throw new Error('Should have errored');
  //       }
  //       done();
  //     }
  //   );
  // });
  // it('should error when deleting avatar of user without metadata', (done) => {
  //   avatarClient.delete(new Empty(), (err: ServiceError | null) => {
  //     expect(err?.code).to.equal(status.UNAUTHENTICATED);
  //     if (!err) {
  //       throw new Error('Should have errored');
  //     }
  //     done();
  //   });
  // });
  // it('should delete avatar of user', (done) => {
  //   avatarClient.delete(
  //     new Empty(),
  //     metadata,
  //     (err: ServiceError | null, res: Empty) => {
  //       if (err) {
  //         throw err;
  //       }
  //       expect(res).to.be.an.instanceOf(Empty);
  //       done();
  //     }
  //   );
  // });
});

// describe('AvatarService - Upload', () => {
//   let accessToken: string;
//   before((done) => {
//     const loginRequest = new LoginRequest();
//     loginRequest.setUsername('user');
//     loginRequest.setPassword('User123');
//     client.login(
//       loginRequest,
//       (err: ServiceError | null, res: DefaultAuthResponse) => {
//         if (err) {
//           throw err;
//         }
//         expect(res.getUser()?.getUsername()).to.equal('user');
//         accessToken = res.getAccessToken();
//         done();
//       }
//     );
//   });

//   it('should  upload avatar ', (done) => {
//     //callback: (error: ServiceError | null, response: UploadImageResponse) => void): ClientWritableStream<UploadImageRequest>
//     const metadata = new Metadata();
//     metadata.set('authorization', `Bearer ${accessToken}`);

//     const uploadCall = avatarClient.uploadImage(
//       metadata,
//       (err: ServiceError | null, res: UploadImageResponse) => {
//         if (err) {
//           throw err;
//         }
//         expect(res.getGeneratedpath()).to.be.a('string');
//         console.log(res.getGeneratedpath());
//         done();
//       }
//     );
//     uploadCall.on('data', (res: UploadImageResponse) => {
//       console.log('DATA:' + res);
//     });
//     uploadCall.on('error', (err: ServiceError) => {
//       throw err;
//     });
//     uploadCall.on('end', () => {
//       console.log('END');
//       done();
//     });
//     const uploadImageRequest = new UploadImageRequest();
//     uploadImageRequest.setInfo(
//       new ImageInfo().setFilename('avatar.png').setType('image/png')
//     );

//     uploadCall.write(uploadImageRequest);

//     const fileStream = fs.createReadStream('./src/test/avatar.png');
//     fileStream.on('data', (chunk) => {
//       const uploadImageRequest = new UploadImageRequest();
//       uploadImageRequest.setChunkData(chunk);
//       uploadCall.write(uploadImageRequest);
//     });
//     fileStream.on('end', () => {
//       console.log('END FILE');
//       uploadCall.end();
//     });
//     fileStream.on('error', (err) => {
//       throw err;
//     });
//   }).timeout(5000);
// });
