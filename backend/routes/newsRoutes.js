const express = require("express");
const router = express.Router();

const newsController = require("../controllers/newsController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

/* ========= PUBLIC ========= */

//  Ambil semua (bisa filter ?status=published)
router.get("/", newsController.getAll);

//  OPTIONAL: endpoint khusus published (clean URL)
router.get("/published", (req, res) => {
  req.query.status = "published";
  newsController.getAll(req, res);
});

router.get("/:id", newsController.getById);

/* ========= ADMIN ========= */

// CREATE
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload("news").single("image"),
  newsController.create
);

// UPDATE (full edit)
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload("news").single("image"),
  newsController.update
);

//  UPDATE STATUS ONLY (SUPER PENTING)
router.patch(
  "/:id/status",
  verifyToken,
  isAdmin,
  newsController.update
);

// DELETE
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  newsController.remove
);

module.exports = router;