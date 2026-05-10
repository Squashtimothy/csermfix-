const express = require("express");

const router = express.Router();

const {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
  archivePublication,
  restorePublication,
} = require("../controllers/publicationController");

const authMiddleware = require("../middleware/authMiddleware");

/* =========================
   PUBLIC ROUTES
========================= */

router.get(
  "/",
  getPublications
);

/* =========================
   ADMIN ROUTES
========================= */

router.post(
  "/",
  authMiddleware,
  createPublication
);

router.put(
  "/:id",
  authMiddleware,
  updatePublication
);

router.delete(
  "/:id",
  authMiddleware,
  deletePublication
);

/* =========================
   ARCHIVE
========================= */

router.patch(
  "/:id/archive",
  authMiddleware,
  archivePublication
);

/* =========================
   RESTORE
========================= */

router.patch(
  "/:id/restore",
  authMiddleware,
  restorePublication
);

module.exports = router;