// const fs = require("fs");
const sendResponse = require("../../helpers/sendResponse");
const db = require("../../services/db.js");
const config = require("../../config.json");
const fs = require("fs");

let AvatarService = {
  uploadAvatar: async (req, res) => {
    let file = req.file;
    if (!file) {
      sendResponse.missingParams(res, {
        message: "Missing file",
      });
      return;
    }
    let user = req.user;
    let originalName = file.originalname;
    let generatedPath = config.files.avatarDir + file.filename;
    let type = file.mimetype;

    let avatarExists = await db.query("SELECT * FROM avatar WHERE userFk = ?", [
      user.id,
    ]);
    let result;
    if (avatarExists.length > 0) {
      fs.unlinkSync(avatarExists[0].generatedPath);
      result = await db.query(
        "UPDATE avatar SET originalName = ?, generatedPath = ?, type = ? WHERE userFk = ?",
        [originalName, generatedPath, type, user.id]
      );
    } else {
      result = await db.query(
        "INSERT INTO avatar (originalName, generatedPath, type, userFk) VALUES (?, ?, ?, ?)",
        [originalName, generatedPath, type, user.id]
      );
    }
    if (!result) {
      sendResponse.error(res, {
        message: "Error uploading avatar",
      });
      return;
    }
    sendResponse.success(res, {
      message: "Avatar uploaded",
      avatar: {
        originalName: originalName,
        generatedPath: generatedPath,
        type: type,
        userFk: user.id,
      },
    });
  },
  deleteAvatar: async (req, res) => {
    let user = req.user;
    let avatar = await db.query("SELECT * FROM avatar WHERE userFk = ?", [
      user.id,
    ]);
    if (avatar.length === 0) {
      sendResponse.error(res, {
        message: "No avatar to delete",
      });
      return;
    }
    avatar = avatar[0];
    let result = await db.query("DELETE FROM avatar WHERE userFk = ?", [
      user.id,
    ]);
    if (!result) {
      sendResponse.error(res, {
        message: "Error deleting avatar",
      });
      return;
    }
    fs.unlink(avatar.generatedPath, (err) => {
      if (err) {
        console.log(err);
      }
    });
    sendResponse.success(res, {
      message: "Avatar deleted",
    });
  },
};

module.exports = AvatarService;
