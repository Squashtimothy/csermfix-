const express = require("express");
const router = express.Router();

const teamController = require("../controllers/teamController");
const auth = require("../middleware/authMiddleware");
const uploadTeam = require("../middleware/uploadTeam");

router.get("/", teamController.getAll);

// admin only
router.post("/", auth.verifyToken, auth.isAdmin, uploadTeam.single("photo"), teamController.create);
router.put("/:id", auth.verifyToken, auth.isAdmin, uploadTeam.single("photo"), teamController.update);
router.delete("/:id", auth.verifyToken, auth.isAdmin, teamController.remove);

module.exports = router;
