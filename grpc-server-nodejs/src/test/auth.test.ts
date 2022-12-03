import chai from 'chai';
import { describe } from 'mocha';
import { expect } from 'chai';
import { prismaClient } from '../services/db';
// import server from '../index';
import speakeasy from 'speakeasy';

import client from './client';
import {
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  DefaultAuthResponse,
  Role,
  EnableTOTPRequest,
  EnableTOTPResponse,
  VerifyTOTPRequest,
  VerifyTOTPResponse,
  DisableTOTPRequest,
  DisableTOTPResponse,
  LogoutRequest,
  LogoutResponse,
} from '../proto/auth_pb';
import { Metadata,  ServiceError, status } from '@grpc/grpc-js';

chai.should();

async function logout(refreshToken:string, doneCallback: Mocha.Done) {
  doneCallback();
  const logoutRequest = new LogoutRequest();
        logoutRequest.setRefreshToken(refreshToken);
        client.logout(logoutRequest, (error: ServiceError | null, response: LogoutResponse) => {
          if (error) {
            throw error;
          }
          expect(response.getSuccess()).to.be.true;
        });
        
}

describe('Auth Service', () => {
  describe('Login', () => {
    it('should login - user', (done) => {
      let refreshToken: string
      after((done) => {
        logout(refreshToken, done);
      });

      const loginUserRequest = new LoginRequest();
      loginUserRequest.setUsername('UsEr'); // case insensitive
      loginUserRequest.setPassword('User123');
      client.login(loginUserRequest, (err, res: DefaultAuthResponse) => {
        if (err) {
          throw err;
        }
        expect(res).to.be.an('object');
        expect(res.getAccessToken()).to.be.a('string');
        expect(res.getUser()?.getRole()).to.be.equal(Role.USER);
        expect(res.getUser()?.getUsername()).to.be.equal('user');
        refreshToken = res.getRefreshToken();
        done();
      });
    });
    it('should login - admin', (done) => {
      let refreshToken: string
      after((done) => {
        logout(refreshToken, done);
      });
      const loginAdminRequest = new LoginRequest();
      loginAdminRequest.setUsername('admin');
      loginAdminRequest.setPassword('Admin123');
      client.login(loginAdminRequest, (err, res: DefaultAuthResponse) => {
        if (err) {
          throw err;
        }
        expect(res).to.be.an('object');
        expect(res.getAccessToken()).to.be.a('string');
        expect(res.getUser()?.getRole()).to.be.equal(Role.ADMIN);
        expect(res.getUser()?.getUsername()).to.be.equal('admin');
        refreshToken = res.getRefreshToken();
        done();
      });
    });
  });
  describe('Login - Fail', () => {
    it('should fail - wrong password', (done) => {
      const loginRequest = new LoginRequest();
      loginRequest.setUsername('admin');
      loginRequest.setPassword('wrongPassword');
      client.login(loginRequest, (err) => {
        expect(err?.code).to.be.equal(status.UNAUTHENTICATED);
        done();
      });
    });
    it('should fail - wrong username', (done) => {
      const loginRequest = new LoginRequest();
      loginRequest.setUsername('wrongUsername');
      loginRequest.setPassword('Admin123');
      client.login(loginRequest, (err) => {
        expect(err?.code).to.be.equal(status.NOT_FOUND);
        done();
      });
    });
  });
  describe('Refresh', () => {
    let accessToken: string;
    let refreshToken: string;
    before((done) => {
      const loginAdminRequest = new LoginRequest();
      loginAdminRequest.setUsername('admin');
      loginAdminRequest.setPassword('Admin123');
      client.login(loginAdminRequest, (err, res: DefaultAuthResponse) => {
        if (err) {
          throw err;
        }
        expect(res).to.be.an('object');
        expect(res.getAccessToken()).to.be.a('string');
        expect(res.getUser()?.getRole()).to.be.equal(Role.ADMIN);
        accessToken = res.getAccessToken();
        refreshToken = res.getRefreshToken();
        done();
      });
    });
    after((done) => {
      logout(refreshToken, done);
      // done();
    });


    it('it should refresh token', (done) => {
      const refreshTokenRequest = new RefreshTokenRequest();
      refreshTokenRequest.setRefreshToken(refreshToken);
      setTimeout(() => {
        client.refreshToken(
          refreshTokenRequest,
          (err, res: DefaultAuthResponse) => {
            if (err) {
              throw err;
            }
            expect(res).to.be.an('object');
            expect(res.getAccessToken()).to.be.a('string');
            expect(res.getAccessToken()).to.not.be.equal(accessToken);
            refreshToken = res.getRefreshToken();
            done();
          }
        );
      }, 1000); // wait 1 second for access token to iat
    }).timeout(5000);
    it('it should fail - wrong refresh token (len != 64 Byte)', (done) => {
      const refreshTokenRequest = new RefreshTokenRequest();
      refreshTokenRequest.setRefreshToken('wrongRefreshToken');
      client.refreshToken(refreshTokenRequest, (err) => {
        
        expect(err?.code).to.be.equal(status.INVALID_ARGUMENT);
        done();
      });
    })
    it('it should fail - wrong refresh token (not in db)', (done) => {
      // Gen 64 Byte random string
      
      const refreshTokenRequest = new RefreshTokenRequest();
      refreshTokenRequest.setRefreshToken('XVlBzgbaiCMRAjWwhTHctcuAxhxKQFDaFpLSjFbcXoEFfRsWxPLDnJObCsNVlgNe');
      client.refreshToken(refreshTokenRequest, (err) => {
        expect(err?.code).to.be.equal(status.UNAUTHENTICATED);
        done();
      });
    })
  });
  describe('Register', () => {
    const username = 'test';
    const password = 'Test123sadw@';
    after((done) => {
      prismaClient.user
        .delete({
          where: {
            username,
          },
        })
        .then(() => {
          done();
        });
    });
    it('should register', (done) => {
      let refreshToken: string;
      after((done) => {
        logout(refreshToken, done);
        });
      const registerRequest = new RegisterRequest();
      registerRequest.setUsername(username);
      registerRequest.setPassword(password);
      client.register(registerRequest, (err, res: DefaultAuthResponse) => {
        if (err) {
          throw err + ' Maybe user wasnt deleted last time?';
        }
        expect(res).to.be.an('object');
        expect(res.getAccessToken()).to.be.a('string');
        expect(res.getUser()?.getRole()).to.be.equal(Role.USER);
        expect(res.getUser()?.getUsername()).to.be.equal(username);
        refreshToken = res.getRefreshToken();
        done();
      });
    });
    it('should fail - username already exists', (done) => {
      const registerRequest = new RegisterRequest();
      registerRequest.setUsername(username);
      registerRequest.setPassword(password);
      client.register(registerRequest, (err) => {
        expect(err?.code).to.be.equal(status.ALREADY_EXISTS);
        done();
      });
    })
    it('should fail - username too short', (done) => {
      const registerRequest = new RegisterRequest();
      registerRequest.setUsername('a');
      registerRequest.setPassword(password);
      client.register(registerRequest, (err) => {
        expect(err?.code).to.be.equal(status.INVALID_ARGUMENT);
        done();
      });
    })
    it('should fail - password too short', (done) => {
      const registerRequest = new RegisterRequest();
      registerRequest.setUsername(username);
      registerRequest.setPassword('a');
      client.register(registerRequest, (err) => {
        expect(err?.code).to.be.equal(status.INVALID_ARGUMENT);
        done();
      });
    })
  });
});

describe('TOTP', () => {
  const metadata = new Metadata(); // metadata for auth interceptor
  let baseSecret: string;

  let refreshToken: string;

  before((done) => {
    const loginAdminRequest = new LoginRequest();
    loginAdminRequest.setUsername('admin');
    loginAdminRequest.setPassword('Admin123');
    client.login(loginAdminRequest, (err, res: DefaultAuthResponse) => {
      if (err) {
        throw err;
      }
      expect(res).to.be.an('object');
      expect(res.getAccessToken()).to.be.a('string');
      expect(res.getUser()?.getRole()).to.be.equal(Role.ADMIN);
      metadata.add('authorization', res.getAccessToken());
      refreshToken = res.getRefreshToken();
      done();
    });
  });
  describe('Enable', () => {
    it('Fail - not logged in', (done) => {
      const enableTOTPRequest = new EnableTOTPRequest();
      enableTOTPRequest.setPassword('Admin123');
      client.enableTOTP(enableTOTPRequest, (err) => {
        expect(err?.code).to.be.equal(status.UNAUTHENTICATED);
        done();
      });
    });
    it('Fail - wrong password', (done) => {
      const enableTOTPRequest = new EnableTOTPRequest();
      enableTOTPRequest.setPassword('wrongPassword');
      client.enableTOTP(enableTOTPRequest, metadata, (err) => {
        expect(err?.code).to.be.equal(status.UNAUTHENTICATED);
        done();
      });
    });
    it('Success', (done) => {
      const enableTOTPRequest = new EnableTOTPRequest();
      enableTOTPRequest.setPassword('Admin123');
      client.enableTOTP(enableTOTPRequest, metadata, (err, res: EnableTOTPResponse) => {
        if (err) {
          throw err;
        }
        expect(res).to.be.an('object');
        expect(res.getSecret()).to.be.a('string');
        expect(res.getUrl()).to.be.a('string');
        expect(res.getSecret()).to.not.be.equal('');
        expect(res.getUrl()).to.not.be.equal('');
        baseSecret = res.getSecret();
        done();
      })
    });
  });
  describe('Verify', () => {
    it('Fail - not logged in', (done) => {
      const verifyTOTPRequest = new VerifyTOTPRequest();
      verifyTOTPRequest.setTotpcode('123456');
      client.verifyTOTP(verifyTOTPRequest, (err) => {
        expect(err?.code).to.be.equal(status.UNAUTHENTICATED);
        done();
      });
    });
    it('Fail - wrong code', (done) => {
      const verifyTOTPRequest = new VerifyTOTPRequest();
      verifyTOTPRequest.setTotpcode('123456');
      client.verifyTOTP(verifyTOTPRequest, metadata, (err) => {
        expect(err?.code).to.be.equal(status.UNAUTHENTICATED);
        done();
      });
    });
    it('Success', (done) => {
      after((done) => {
        logout(refreshToken, done);
      });
      const token = speakeasy.totp({
        secret: baseSecret,
        encoding: 'base32',
      });
      const verifyTOTPRequest = new VerifyTOTPRequest();
      verifyTOTPRequest.setTotpcode(token);
      client.verifyTOTP(verifyTOTPRequest, metadata, (err, res: VerifyTOTPResponse) => {
        if (err) {
          throw err;
        }
        expect(res).to.be.an('object');
        expect(res.getSuccess()).to.be.equal(true);
        done();
      });
    });
  });

  describe('TOTP Login', () => {
    it('Fail - wrong code', (done) => {
      const loginRequest = new LoginRequest();
      loginRequest.setUsername('admin');
      loginRequest.setPassword('Admin123');
      loginRequest.setTotpcode('123456');
      client.login(loginRequest, (err) => {
        expect(err?.code).to.be.equal(status.UNAUTHENTICATED);
        done();
      });
    });
    it('Success', (done) => {

      let refreshToken: string;
      after((done) => {
        logout(refreshToken, done);
      });
      const token = speakeasy.totp({
        secret: baseSecret,
        encoding: 'base32',
      });
      const loginRequest = new LoginRequest();
      loginRequest.setUsername('admin');
      loginRequest.setPassword('Admin123');
      loginRequest.setTotpcode(token);
      client.login(loginRequest, (err, res: DefaultAuthResponse) => {
        if (err) {
          throw err;
        }
        expect(res).to.be.an('object');
        expect(res.getAccessToken()).to.be.a('string');
        expect(res.getUser()?.getRole()).to.be.equal(Role.ADMIN);
        refreshToken = res.getRefreshToken();
        done();
      });
    });
  });


  describe('Disable TOTP', () => {
    it('disable TOTP - wrong password', (done) => {
      const disableTOTPRequest = new DisableTOTPRequest();
      disableTOTPRequest.setPassword('wrongPassword');
      const token = speakeasy.totp({
        secret: baseSecret,
        encoding: 'base32',
      });
      disableTOTPRequest.setTotpcode(token);
      client.disableTOTP(
        disableTOTPRequest,
        metadata,
        (err: ServiceError | null) => {
          expect(err?.code).to.be.equal(status.UNAUTHENTICATED);
          done();
        })
    })
    it('disable TOTP - wrong totpcode', (done) => {
      const disableTOTPRequest = new DisableTOTPRequest();
      disableTOTPRequest.setPassword('Admin123');
      disableTOTPRequest.setTotpcode('wrongCode');
      client.disableTOTP(
        disableTOTPRequest,
        metadata,
        (err: ServiceError | null) => {
          expect(err?.code).to.be.equal(status.INVALID_ARGUMENT);
          done();
        })
    })
    it('disable TOTP - correct', (done) => {
      const disableTOTPRequest = new DisableTOTPRequest();
      disableTOTPRequest.setPassword('Admin123');
      const token = speakeasy.totp({
        secret: baseSecret,
        encoding: 'base32',
      });
      disableTOTPRequest.setTotpcode(token);
      client.disableTOTP(
        disableTOTPRequest,
        metadata,
        (err: ServiceError | null, res: DisableTOTPResponse) => {
          expect(err).to.be.equal(null);
          expect(res).to.be.an('object');
          expect(res.getSuccess()).to.be.equal(true);
          done();
        })
    })
  })  

});

describe('Logout', () => {
  it('Fail - not logged in', (done) => {
    const logoutRequest = new LogoutRequest();
    client.logout(logoutRequest, (err) => {
      expect(err?.code).to.be.equal(status.INVALID_ARGUMENT);
      done();
    })
  })
  it('Fail - wrong refresh token', (done) => {
    const logoutRequest = new LogoutRequest();
    logoutRequest.setRefreshToken('wrongRefreshToken');
    client.logout(logoutRequest, (err) => {
      expect(err?.code).to.be.equal(status.INVALID_ARGUMENT);
      done();
    })
  }
  )
  let refreshToken: string;
  before((done) => {
    const loginRequest = new LoginRequest();
    loginRequest.setUsername('admin');
    loginRequest.setPassword('Admin123');
    client.login(loginRequest, (err, res: DefaultAuthResponse) => {
      if (err) {
        throw err;
      }
      refreshToken = res.getRefreshToken();
      done();
    });
  });
  it('Success', (done) => {

    const logoutRequest = new LogoutRequest();
    logoutRequest.setRefreshToken(refreshToken);
    client.logout(logoutRequest, (err, res: LogoutResponse) => {
      expect(err).to.be.equal(null);
      expect(res).to.be.an('object');
      expect(res.getSuccess()).to.be.equal(true);
      done();
    })
  })
})
