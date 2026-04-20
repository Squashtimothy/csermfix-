const express = require("express");
const router = express.Router();

const {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
} = require("../controllers/publicationController");

// public read
router.get("/", getPublications);

// CRUD
router.post("/", createPublication);
router.put("/:id", updatePublication);
router.delete("/:id", deletePublication);

module.exports = router;