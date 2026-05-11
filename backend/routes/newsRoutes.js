const express = require("express");

const router = express.Router();

/* =========================
   CONTROLLER
========================= */

const newsController = require(
  "../controllers/newsController"
);

/* =========================
   MIDDLEWARE
========================= */

const {
  verifyToken,
  isAdmin,
} = require(
  "../middleware/authMiddleware"
);

const upload = require(
  "../middleware/upload"
);

/* =====================================================
   PUBLIC ROUTES
===================================================== */

/**
 * GET ALL NEWS
 * GET /api/news
 */
router.get(
  "/",
  newsController.getAll
);

/**
 * GET PUBLISHED NEWS
 * GET /api/news/published
 */
router.get(
  "/published",
  newsController.getPublished
);

/**
 * GET DETAIL NEWS
 * GET /api/news/:id
 */
router.get(
  "/:id",
  newsController.getById
);

/* =====================================================
   ADMIN ROUTES
===================================================== */

/**
 * CREATE NEWS
 * POST /api/news
 */
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload("news").single("image"),
  newsController.create
);

/**
 * UPDATE NEWS
 * PUT /api/news/:id
 */
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload("news").single("image"),
  newsController.update
);

/**
 * UPDATE STATUS
 * PATCH /api/news/:id/status
 */
router.patch(
  "/:id/status",
  verifyToken,
  isAdmin,
  newsController.updateStatus
);

/**
 * DELETE NEWS
 * DELETE /api/news/:id
 */
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  newsController.remove
);

/* =====================================================
   EXPORT
===================================================== */

module.exports = router;