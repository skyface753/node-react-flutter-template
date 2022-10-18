import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import { expect } from 'chai';
import server from '../index';
import fs from 'fs';
chai.use(chaiHttp);
import credentials from './credentials.json';

describe('Avatar', () => {
  let cookie = '';
  before((done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        password: credentials.user.password,
        username: credentials.user.username,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        cookie = res.header['set-cookie'];
        done();
      });
  });
  let generatedAvatarPath = '';
  describe('/POST avatar-upload', () => {
    it('it should upload a avatar', (done) => {
      chai
        .request(server)
        .put('/api/avatar/upload')
        .attach('avatar', './src/test/avatar.png')
        .set('Cookie', cookie)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data.avatar).to.have.property('generatedpath');
          generatedAvatarPath = res.body.data.avatar.generatedpath;
          done();
        });
    }).timeout(5000);
  });
  describe('/GET avatar-download', () => {
    it('it should display the avatar', (done) => {
      chai
        .request(server)
        .get('/' + generatedAvatarPath)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an.instanceof(Buffer);
          expect(res.header['content-type']).to.equal('image/png');
          done();
        });
    });
  });
  describe('/POST avatar-delete', () => {
    before((done) => {
      //Check if avatar exists
      if (fs.existsSync(generatedAvatarPath)) {
        done();
      } else {
        throw new Error('Avatar does not exist');
      }
    });
    after((done) => {
      //Check if avatar exists
      // Wait for 1 second to make sure the avatar is deleted
      setTimeout(() => {
        if (fs.existsSync(generatedAvatarPath)) {
          throw new Error('Avatar still exists');
        } else {
          done();
        }
      }, 1000);
    });
    it('it should delete a avatar', (done) => {
      chai
        .request(server)
        .delete('/api/avatar/delete')
        .set('Cookie', cookie)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          done();
        });
    });
  });
});
