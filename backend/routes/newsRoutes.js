const express = require("express");
const router = express.Router();

const newsController = require("../controllers/newsController");

const {
  verifyToken,
  isAdmin,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

/* =========================
   PUBLIC
========================= */

router.get(
  "/",
  newsController.getAll
);

router.get(
  "/published",
  newsController.getPublished
);

router.get(
  "/:id",
  newsController.getById
);

/* =========================
   ADMIN
========================= */

router.post(
  "/",
  verifyToken,
  isAdmin,
  upload("news").single("image"),
  newsController.create
);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload("news").single("image"),
  newsController.update
);

router.patch(
  "/:id/status",
  verifyToken,
  isAdmin,
  newsController.updateStatus
);

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  newsController.remove
);

module.exports = router;