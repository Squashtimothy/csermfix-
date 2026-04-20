const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

/* =========================
   PUBLIC
========================= */

// page settings
router.get("/page-settings", projectController.getProjectPageSettings);

// featured + list
router.get("/featured", projectController.getFeaturedProject);
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProjectById);

// project blocks public
router.get("/:projectId/blocks", projectController.getProjectBlocks);

/* =========================
   ADMIN - PAGE SETTINGS
========================= */

router.put(
  "/page-settings",
  verifyToken,
  isAdmin,
  upload("projects").single("image"),
  projectController.updateProjectPageSettings
);

/* =========================
   ADMIN - PROJECTS
========================= */

router.get("/admin/all", verifyToken, isAdmin, projectController.getProjectsAdmin);

router.post(
  "/",
  verifyToken,
  isAdmin,
  upload("projects").single("image"),
  projectController.createProject
);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload("projects").single("image"),
  projectController.updateProject
);

router.delete("/:id", verifyToken, isAdmin, projectController.deleteProject);

/* =========================
   ADMIN - BLOCKS
========================= */

router.get(
  "/:projectId/blocks/admin",
  verifyToken,
  isAdmin,
  projectController.getProjectBlocksAdmin
);

router.post(
  "/:projectId/blocks",
  verifyToken,
  isAdmin,
  upload("projects").single("image"),
  projectController.createProjectBlock
);

router.put(
  "/blocks/:id",
  verifyToken,
  isAdmin,
  upload("projects").single("image"),
  projectController.updateProjectBlock
);

router.delete(
  "/blocks/:id",
  verifyToken,
  isAdmin,
  projectController.deleteProjectBlock
);

module.exports = router;