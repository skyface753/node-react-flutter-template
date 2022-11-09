import chai from 'chai';
import { describe } from 'mocha';
import { expect } from 'chai';
import server from '../index';
import client from './client';
import { LoginRequest, LoginResponse, Role } from '../proto/auth_pb';

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
      client.login(loginUserRequest, (err, res: LoginResponse) => {
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
      client.login(loginAdminRequest, (err, res: LoginResponse) => {
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
});
