const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

console.log("typeof authController.login:", typeof authController.login);
console.log("typeof authController.createAdmin:", typeof authController.createAdmin);
console.log("typeof verifyToken:", typeof authMiddleware.verifyToken);
console.log("typeof isSuperAdmin:", typeof authMiddleware.isSuperAdmin);


router.post("/login", authController.login);
router.post(
  "/create-admin",
  authMiddleware.verifyToken,
  authMiddleware.isSuperAdmin,
  authController.createAdmin
);

module.exports = router;
