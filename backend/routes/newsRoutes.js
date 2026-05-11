const express = require("express");

const router = express.Router();

const newsController = require("../controllers/newsController");

const {
  verifyToken,
  isAdmin,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

/* =========================
   TEST ROUTE
========================= */

router.post("/test", (req, res) => {
  return res.json({
    success: true,
    message: "POST ROUTE WORKING",
  });
});

/* =========================
   GET ALL
========================= */

router.get("/", newsController.getAll);

/* =========================
   GET PUBLISHED
========================= */

router.get("/published", (req, res) => {
  req.query.status = "published";

  return newsController.getAll(req, res);
});

/* =========================
   GET BY ID
========================= */

router.get("/:id", newsController.getById);

/* =========================
   CREATE NEWS
========================= */

router.post(
  "/",
  verifyToken,
  isAdmin,
  upload("news").single("image"),
  newsController.create
);

/* =========================
   UPDATE NEWS
========================= */

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload("news").single("image"),
  newsController.update
);

/* =========================
   UPDATE STATUS
========================= */

router.patch(
  "/:id/status",
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      console.log("STATUS UPDATE:", id, status);

      if (!status) {
        return res.status(400).json({
          message: "Status wajib diisi",
        });
      }

      const db = require("../config/db");

      await db.query(
        "UPDATE news SET status=? WHERE id=?",
        [status, id]
      );

      return res.json({
        success: true,
        message: "Status berhasil diupdate",
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: "Server error",
      });
    }
  }
);

/* =========================
   DELETE NEWS
========================= */

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  newsController.remove
);

module.exports = router;