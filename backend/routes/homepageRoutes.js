const express = require("express");
const router = express.Router();

const homepageController = require("../controllers/homepageController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

/* ========================
   PUBLIC
======================== */

router.get("/profile", homepageController.getProfile);
router.get("/hero", homepageController.getHero);
router.get("/aims", homepageController.getAims);
router.get("/vision-mission", homepageController.getVisionMission);


/* ========================
   ADMIN
======================== */

router.put("/profile", verifyToken, isAdmin, homepageController.updateProfile);

router.get("/hero/admin", verifyToken, isAdmin, homepageController.getHeroAdmin);

router.post(
  "/hero",
  verifyToken,
  isAdmin,
  upload("hero").single("image"),
  homepageController.createHero
);

router.put(
  "/hero/:id",
  verifyToken,
  isAdmin,
  upload("hero").single("image"),
  homepageController.updateHero
);

router.delete(
  "/hero/:id",
  verifyToken,
  isAdmin,
  homepageController.deleteHero
);


/* ========================
   AIMS
======================== */

router.get("/aims/admin", verifyToken, isAdmin, homepageController.getAimsAdmin);

router.post(
  "/aims",
  verifyToken,
  isAdmin,
  upload("aims").single("image"),
  homepageController.createAim
);

router.put(
  "/aims/:id",
  verifyToken,
  isAdmin,
  upload("aims").single("image"),
  homepageController.updateAim
);

router.delete(
  "/aims/:id",
  verifyToken,
  isAdmin,
  homepageController.deleteAim
);


/* ========================
   VISION MISSION
======================== */

router.put(
  "/vision-mission",
  verifyToken,
  isAdmin,
  upload("vision").single("image"),
  homepageController.updateVisionMission
);

router.get("/vision-mission", homepageController.getVisionMission);


module.exports = router;