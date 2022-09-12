const multer = require("multer");
const config = require("../config.json");

// MULTER
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.files.avatarDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      req.user.id + "_" + Date.now() + "." + file.originalname.split(".").pop()
    );
  },
});

const uploadAvatar = multer({ storage: avatarStorage });

module.exports = {
  uploadAvatar: uploadAvatar,
};
