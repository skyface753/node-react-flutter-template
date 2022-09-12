let chai = require("chai");
let chaiHttp = require("chai-http");
const { describe } = require("mocha");
let should = chai.should();
let server = require("../index");
const fs = require("fs");
chai.use(chaiHttp);

const credentials = require("./credentials.json");

describe("Avatar", () => {
  let cookie = "";
  before((done) => {
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
        cookie = res.headers["set-cookie"];
        done();
      });
  });
  let generatedAvatarPath = "";
  describe("/POST avatar-upload", () => {
    it("it should upload a avatar", (done) => {
      chai
        .request(server)
        .post("/api/files/avatar/upload")
        .attach("avatar", "./test/avatar.png")
        .set("Cookie", cookie)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.success.should.be.true;
          res.body.data.avatar.should.have.property("generatedPath");
          generatedAvatarPath = res.body.data.avatar.generatedPath;
          done();
        });
    });
  });
  describe("/GET avatar-download", () => {
    it("it should display the avatar", (done) => {
      chai
        .request(server)
        .get("/" + generatedAvatarPath)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.have.header("content-type", "image/png");
          done();
        });
    });
  });
  describe("/POST avatar-delete", () => {
    before((done) => {
      //Check if avatar exists
      if (fs.existsSync(generatedAvatarPath)) {
        done();
      } else {
        throw new Error("Avatar does not exist");
      }
    });
    after((done) => {
      //Check if avatar exists
      if (fs.existsSync(generatedAvatarPath)) {
        throw new Error("Avatar still exists");
      } else {
        done();
      }
    });
    it("it should delete a avatar", (done) => {
      chai
        .request(server)
        .post("/api/files/avatar/delete")
        .set("Cookie", cookie)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.success.should.be.true;
          done();
        });
    });
  });
});
