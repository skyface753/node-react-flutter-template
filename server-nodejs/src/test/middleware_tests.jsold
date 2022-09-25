let chai = require('chai');
let chaiHttp = require('chai-http');
const { describe } = require('mocha');
let expect = chai.expect;
let server = require('../index');

chai.use(chaiHttp);

const credentials = require('./credentials.json');

describe('Routes as anonymous', () => {
  describe('/POST anonymous', () => {
    it('Route should be accessible without login - no cookie', (done) => {
      chai
        .request(server)
        .post('/api/test/anonym')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data.message).to.equal('Anonymous');
          done();
        });
    });
  });
  describe('/POST userIfCookie', () => {
    it('Route should be accessible anonymous - cookie is optional', (done) => {
      chai
        .request(server)
        .post('/api/test/userIfCookie')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.data.user).to.equal('No user');
          done();
        });
    });
  });
  describe('/POST user', () => {
    it('Route should not be accessible anonymous - cookie is required', (done) => {
      chai
        .request(server)
        .post('/api/test/user')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.success).to.equal(false);
          done();
        });
    });
  });
  describe('/POST admin', () => {
    it('Route should not be accessible anonymous - cookie is required', (done) => {
      chai
        .request(server)
        .post('/api/test/admin')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.success).to.equal(false);
          done();
        });
    });
  });
});

describe('Routes as User', () => {
  let cookie = '';
  before((done) => {
    chai
      .request(server)
      .post('/api/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        email: credentials.user.email,
        password: 'User123',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data.user.roleFk).to.equal(1);
        cookie = res.headers['set-cookie'];
        done();
      });
  });
  describe('/POST anonymous', () => {
    it('Route should be accessible without login - no cookie', (done) => {
      chai
        .request(server)
        .post('/api/test/anonym')
        .set('Cookie', cookie)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data.message).to.equal('Anonymous');
          done();
        });
    });
  });
  describe('/POST userIfCookie', () => {
    it('Route should be accessible anonymous - cookie is optional', (done) => {
      chai
        .request(server)
        .post('/api/test/userIfCookie')
        .set('Cookie', cookie)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.data.user.email).to.equal(credentials.user.email);
          done();
        });
    });
  });
  describe('/POST user', () => {
    it('Route should be accessible user - cookie is required', (done) => {
      chai
        .request(server)
        .post('/api/test/user')
        .set('Cookie', cookie)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.data.user.email).to.equal(credentials.user.email);
          done();
        });
    });
    describe('/POST admin', () => {
      it('Route should not be accessible user - cookie is required', (done) => {
        chai
          .request(server)
          .post('/api/test/admin')
          .set('Cookie', cookie)
          .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body.success).to.equal(false);
            done();
          });
      });
    });
  });
});

describe('Routes as Admin', () => {
  let cookie = '';
  before((done) => {
    chai
      .request(server)
      .post('/api/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        email: credentials.admin.email,
        password: 'Admin123',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data.user.roleFk).to.equal(2);
        cookie = res.headers['set-cookie'];
        done();
      });
  });
  describe('/POST anonymous', () => {
    it('Route should be accessible without login - no cookie', (done) => {
      chai
        .request(server)
        .post('/api/test/anonym')
        .set('Cookie', cookie)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data.message).to.equal('Anonymous');
          done();
        });
    });
  });
  describe('/POST userIfCookie', () => {
    it('Route should be accessible anonymous - cookie is optional', (done) => {
      chai
        .request(server)
        .post('/api/test/userIfCookie')
        .set('Cookie', cookie)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.data.user.email).to.equal(credentials.admin.email);
          expect(res.body.data.user.roleFk).to.equal(2);
          done();
        });
    });
  });
  describe('/POST user', () => {
    it('Route should be accessible user - cookie is required', (done) => {
      chai
        .request(server)
        .post('/api/test/user')
        .set('Cookie', cookie)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.data.user.email).to.equal(credentials.admin.email);
          expect(res.body.data.user.roleFk).to.equal(2);
          done();
        });
    });
  });
  describe('/POST admin', () => {
    it('Route should be accessible admin - cookie is required', (done) => {
      chai
        .request(server)
        .post('/api/test/admin')
        .set('Cookie', cookie)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.data.user.email).to.equal(credentials.admin.email);
          expect(res.body.data.user.roleFk).to.equal(2);
          done();
        });
    });
  });
});
