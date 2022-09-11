let chai = require("chai");
let chaiHttp = require("chai-http");
const { describe } = require("mocha");
let should = chai.should();
let server = require("../index");

chai.use(chaiHttp);

const credentials = require("./credentials.json");

describe("Login", () => {
  describe("/POST login-user-success", () => {
    it("it should login a user with user role", (done) => {
      chai
        .request(server)
        .post("/api/login")
        .set("content-type", "application/x-www-form-urlencoded")
        .send({
          email: credentials.user.email,
          password: credentials.user.password,
        })

        .end((err, res) => {
          res.should.have.status(200);
          res.body.success.should.be.true;
          res.body.data.user.roleFk.should.be.equal(1);
          done();
        });
    });
  });
  describe("/POST login-user-fail", () => {
    it("it should not login a user with wrong email", (done) => {
      chai
        .request(server)
        .post("/api/login")
        .set("content-type", "application/x-www-form-urlencoded")
        .send({
          email: "notAMail@example.de",
          password: credentials.user.password,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.success.should.be.false;
          done();
        });
    });
    it("it should not login a user with wrong password", (done) => {
      chai
        .request(server)
        .post("/api/login")
        .set("content-type", "application/x-www-form-urlencoded")
        .send({
          email: credentials.user.email,
          password: "wrongPassword",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.success.should.be.false;
          done();
        });
    });
  });
  describe("/POST login-admin-success", () => {
    it("it should login a user with admin role", (done) => {
      chai
        .request(server)
        .post("/api/login")
        .set("content-type", "application/x-www-form-urlencoded")
        .send({
          email: credentials.admin.email,
          password: credentials.admin.password,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.success.should.be.true;
          res.body.data.user.roleFk.should.be.equal(2);
          done();
        });
    });
  });
  // Login Admin Fail handled in user login fail
});

// DB Service to delete registered user
const db = require("../services/db");

describe("Register", () => {
  describe("/POST register-user-success", () => {
    it("it should register a user with user role", (done) => {
      chai
        .request(server)
        .post("/api/register")
        .set("content-type", "application/x-www-form-urlencoded")
        .send({
          email: credentials.newUser.email,
          password: credentials.newUser.password,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.success.should.be.true;
          res.body.data.user.roleFk.should.be.equal(1);
          done();
        });
    });
  });
  describe("/POST register-user-fail", () => {
    it("it should not register a user with existing email", (done) => {
      after(async () => {
        await db.query("DELETE FROM user WHERE email = ?", [
          credentials.newUser.email,
        ]);
      });
      chai
        .request(server)
        .post("/api/register")
        .set("content-type", "application/x-www-form-urlencoded")
        .send({
          email: credentials.newUser.email, // Existing email
          password: credentials.newUser.password,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.success.should.be.false;
          done();
        });
    });
  });
});

describe("Logout", () => {
  describe("/POST logout-success", () => {
    it("it should logout a user", (done) => {
      chai
        .request(server)
        .post("/api/logout")
        .set("content-type", "application/x-www-form-urlencoded")
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.success.should.be.true;
          done();
        });
    });
  });
});
