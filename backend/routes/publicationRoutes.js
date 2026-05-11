const express = require("express");

const router = express.Router();

/* =========================
   CONTROLLERS
========================= */

const {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
  archivePublication,
  restorePublication,
} = require("../controllers/publicationController");

/* =========================
   MIDDLEWARE
========================= */

const {
  verifyToken,
} = require("../middleware/authMiddleware");

/* =========================
   DEBUG
========================= */

console.log(
  "typeof getPublications:",
  typeof getPublications
);

console.log(
  "typeof createPublication:",
  typeof createPublication
);

console.log(
  "typeof verifyToken:",
  typeof verifyToken
);

/* =========================
   PUBLIC ROUTES
========================= */

// GET ALL PUBLICATIONS
router.get(
  "/",
  getPublications
);

/* =========================
   ADMIN ROUTES
========================= */

// CREATE
router.post(
  "/",
  verifyToken,
  createPublication
);

// UPDATE
router.put(
  "/:id",
  verifyToken,
  updatePublication
);

// DELETE
router.delete(
  "/:id",
  verifyToken,
  deletePublication
);

/* =========================
   ARCHIVE
========================= */

// ARCHIVE
router.patch(
  "/:id/archive",
  verifyToken,
  archivePublication
);

/* =========================
   RESTORE
========================= */

// RESTORE
router.patch(
  "/:id/restore",
  verifyToken,
  restorePublication
);

/* =========================
   EXPORT
========================= */

module.exports = router;