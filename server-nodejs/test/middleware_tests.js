let chai = require("chai");
let chaiHttp = require("chai-http");
const { describe } = require("mocha");
let should = chai.should();
let server = require("../index");

chai.use(chaiHttp);

const credentials = require("./credentials.json");

describe("Routes as anonymous", () => {
  describe("/POST anonymous", () => {
    it("Route should be accessible without login - no cookie", (done) => {
      chai
        .request(server)
        .post("/api/test/anonym")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.success.should.be.true;
          res.body.data.message.should.be.equal("Anonymous");
          done();
        });
    });
  });
  describe("/POST userIfCookie", () => {
    it("Route should be accessible anonymous - cookie is optional", (done) => {
      chai
        .request(server)
        .post("/api/test/userIfCookie")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.success.should.be.true;
          res.body.data.user.should.be.equal("No user");
          done();
        });
    });
  });
  describe("/POST user", () => {
    it("Route should not be accessible anonymous - cookie is required", (done) => {
      chai
        .request(server)
        .post("/api/test/user")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.success.should.be.false;
          done();
        });
    });
  });
  describe("/POST admin", () => {
    it("Route should not be accessible anonymous - cookie is required", (done) => {
      chai
        .request(server)
        .post("/api/test/admin")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.success.should.be.false;
          done();
        });
    });
  });
});

describe("Routes as User", () => {
  let cookie = "";
  before((done) => {
    chai
      .request(server)
      .post("/api/login")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        email: credentials.user.email,
        password: "User123",
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.success.should.be.true;
        res.body.data.user.roleFk.should.be.equal(1);
        cookie = res.headers["set-cookie"];
        done();
      });
  });
  describe("/POST anonymous", () => {
    it("Route should be accessible without login - no cookie", (done) => {
      chai
        .request(server)
        .post("/api/test/anonym")
        .set("Cookie", cookie)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.success.should.be.true;
          res.body.data.message.should.be.equal("Anonymous");
          done();
        });
    });
  });
  describe("/POST userIfCookie", () => {
    it("Route should be accessible anonymous - cookie is optional", (done) => {
      chai
        .request(server)
        .post("/api/test/userIfCookie")
        .set("Cookie", cookie)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.success.should.be.true;
          res.body.data.user.email.should.be.equal(credentials.user.email);
          done();
        });
    });
  });
  describe("/POST user", () => {
    it("Route should be accessible user - cookie is required", (done) => {
      chai
        .request(server)
        .post("/api/test/user")
        .set("Cookie", cookie)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.success.should.be.true;
          res.body.data.user.email.should.be.equal(credentials.user.email);
          done();
        });
    });
    describe("/POST admin", () => {
      it("Route should not be accessible user - cookie is required", (done) => {
        chai
          .request(server)
          .post("/api/test/admin")
          .set("Cookie", cookie)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.success.should.be.false;
            done();
          });
      });
    });
  });
});

describe("Routes as Admin", () => {
  let cookie = "";
  before((done) => {
    chai
      .request(server)
      .post("/api/login")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        email: credentials.admin.email,
        password: "Admin123",
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.success.should.be.true;
        res.body.data.user.roleFk.should.be.equal(2);
        cookie = res.headers["set-cookie"];
        done();
      });
  });
  describe("/POST anonymous", () => {
    it("Route should be accessible without login - no cookie", (done) => {
      chai
        .request(server)
        .post("/api/test/anonym")
        .set("Cookie", cookie)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.success.should.be.true;
          res.body.data.message.should.be.equal("Anonymous");
          done();
        });
    });
  });
  describe("/POST userIfCookie", () => {
    it("Route should be accessible anonymous - cookie is optional", (done) => {
      chai
        .request(server)
        .post("/api/test/userIfCookie")
        .set("Cookie", cookie)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.success.should.be.true;
          res.body.data.user.email.should.be.equal(credentials.admin.email);
          res.body.data.user.roleFk.should.be.equal(2);
          done();
        });
    });
  });
  describe("/POST user", () => {
    it("Route should be accessible user - cookie is required", (done) => {
      chai
        .request(server)
        .post("/api/test/user")
        .set("Cookie", cookie)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.success.should.be.true;
          res.body.data.user.email.should.be.equal(credentials.admin.email);
          res.body.data.user.roleFk.should.be.equal(2);
          done();
        });
    });
  });
  describe("/POST admin", () => {
    it("Route should be accessible admin - cookie is required", (done) => {
      chai
        .request(server)
        .post("/api/test/admin")
        .set("Cookie", cookie)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.success.should.be.true;
          res.body.data.user.email.should.be.equal(credentials.admin.email);
          res.body.data.user.roleFk.should.be.equal(2);
          done();
        });
    });
  });
});
