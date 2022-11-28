import chai from 'chai';
import { describe } from 'mocha';
import { expect } from 'chai';
import db from '../services/db';
import server from '../index';
import client from './client';
import {
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  DefaultAuthResponse,
  Role,
} from '../proto/auth_pb';

chai.should();

describe('Server', () => {
  it('should be running', () => {
    expect(server).to.be.an('object');
  });
});

describe('Auth Service', () => {
  describe('Login', () => {
    it('should login - user', (done) => {
      const loginUserRequest = new LoginRequest();
      loginUserRequest.setUsername('user');
      loginUserRequest.setPassword('User123');
      client.login(loginUserRequest, (err, res: DefaultAuthResponse) => {
        if (err) {
          throw err;
        }
        console.log(res.toObject());
        expect(res).to.be.an('object');
        expect(res.getAccessToken()).to.be.a('string');
        expect(res.getUser()?.getRole()).to.be.equal(Role.USER);
        done();
      });
    });
    it('should login - admin', (done) => {
      const loginAdminRequest = new LoginRequest();
      loginAdminRequest.setUsername('admin');
      loginAdminRequest.setPassword('Admin123');
      client.login(loginAdminRequest, (err, res: DefaultAuthResponse) => {
        if (err) {
          throw err;
        }
        console.log(res.toObject());
        expect(res).to.be.an('object');
        expect(res.getAccessToken()).to.be.a('string');
        expect(res.getUser()?.getRole()).to.be.equal(Role.ADMIN);
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
        console.log(res.toObject());
        expect(res).to.be.an('object');
        expect(res.getAccessToken()).to.be.a('string');
        expect(res.getUser()?.getRole()).to.be.equal(Role.ADMIN);
        accessToken = res.getAccessToken();
        refreshToken = res.getRefreshToken();
        done();
      });
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
            console.log(res.toObject());
            expect(res).to.be.an('object');
            expect(res.getAccessToken()).to.be.a('string');
            expect(res.getAccessToken()).to.not.be.equal(accessToken);
            done();
          }
        );
      }, 1000); // wait 1 second for access token to iat
    }).timeout(5000);
  });
  describe('Register', () => {
    const username = 'test';
    const password = 'Test123sadw@';
    after((done) => {
      db.queryPrimary(
        'DELETE FROM testuser.user WHERE LOWER(username) = LOWER($1)',
        [username]
      ).then(() => {
        done();
      });
    });
    it('should register', (done) => {
      const registerRequest = new RegisterRequest();
      registerRequest.setUsername(username);
      registerRequest.setPassword(password);
      client.register(registerRequest, (err, res: DefaultAuthResponse) => {
        if (err) {
          throw err + ' Maybe user wasnt deleted last time?';
        }
        console.log(res.toObject());
        expect(res).to.be.an('object');
        expect(res.getAccessToken()).to.be.a('string');
        expect(res.getUser()?.getRole()).to.be.equal(Role.USER);
        expect(res.getUser()?.getUsername()).to.be.equal(username);
        done();
      });
    });
  });
});
