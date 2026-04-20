const multer = require("multer");
const path = require("path");
const fs = require("fs");

function upload(folderName = "misc") {
  const safeFolder =
    String(folderName).replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase() || "misc";

  const targetDir = path.join(__dirname, "..", "uploads", safeFolder);
  fs.mkdirSync(targetDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, targetDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeExt = ext === ".jpeg" ? ".jpg" : ext;
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedMime = ["image/jpeg", "image/png", "image/webp"];
    const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedMime.includes(file.mimetype) || !allowedExt.includes(ext)) {
      return cb(new Error("Only image files allowed"), false);
    }

    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  });
}

module.exports = upload;