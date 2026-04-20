const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, (req, res) => {
  const { section, text } = req.body;

  db.query(
    "INSERT INTO content (section, text) VALUES (?, ?)",
    [section, text],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Content created" });
    }
  );
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM content", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

router.put("/:id", auth, (req, res) => {
  const { section, text } = req.body;

  db.query(
    "UPDATE content SET section=?, text=? WHERE id=?",
    [section, text, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Content updated" });
    }
  );
});

router.delete("/:id", auth, (req, res) => {
  db.query("DELETE FROM content WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Content deleted" });
  });
});

module.exports = router;
