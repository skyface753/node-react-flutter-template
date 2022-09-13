let chai = require('chai');
let chaiHttp = require('chai-http');
const { describe } = require('mocha');
let expect = chai.expect;
let server = require('../index');
const fs = require('fs');
chai.use(chaiHttp);

const credentials = require('./credentials.json');

describe('Avatar', () => {
  let cookie = '';
  before((done) => {
    chai
      .request(server)
      .post('/api/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        email: credentials.user.email,
        password: credentials.user.password,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        cookie = res.headers['set-cookie'];
        done();
      });
  });
  let generatedAvatarPath = '';
  describe('/POST avatar-upload', () => {
    it('it should upload a avatar', (done) => {
      chai
        .request(server)
        .put('/api/files/avatar/upload')
        .attach('avatar', './test/avatar.png')
        .set('Cookie', cookie)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data.avatar).to.have.property('generatedPath');
          generatedAvatarPath = res.body.data.avatar.generatedPath;
          done();
        });
    });
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
      if (fs.existsSync(generatedAvatarPath)) {
        throw new Error('Avatar still exists');
      } else {
        done();
      }
    });
    it('it should delete a avatar', (done) => {
      chai
        .request(server)
        .delete('/api/files/avatar/delete')
        .set('Cookie', cookie)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          done();
        });
    });
  });
});
