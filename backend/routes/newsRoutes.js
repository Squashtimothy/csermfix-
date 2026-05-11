const express = require("express");

const router = express.Router();

const newsController = require("../controllers/newsController");

const {
  verifyToken,
  isAdmin,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

/* =========================
   PUBLIC ROUTES
========================= */

// GET ALL
router.get(
  "/",
  newsController.getAll
);

// GET PUBLISHED ONLY
router.get(
  "/published",
  (req, res) => {
    req.query.status = "published";

    newsController.getAll(req, res);
  }
);

// GET DETAIL
router.get(
  "/:id",
  newsController.getById
);

/* =========================
   ADMIN ROUTES
========================= */

// CREATE
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload("news").single("image"),
  newsController.create
);

// UPDATE FULL
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload("news").single("image"),
  newsController.update
);

// UPDATE STATUS ONLY
router.patch(
  "/:id/status",
  verifyToken,
  isAdmin,
  newsController.updateStatus
);

// DELETE
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  newsController.remove
);

module.exports = router;