const db = require("../config/db");
const fs = require("fs");
const path = require("path");

/* =========================
   HELPERS
========================= */
const toInt = (v, def = 1) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

const heroDbPath = (filename) => `hero/${filename}`;
const aimsDbPath = (filename) => `aims/${filename}`;
const visionDbPath = (filename) => `vision/${filename}`;

const safeUnlink = (relative) => {
  try {
    if (!relative) return;
    const abs = path.join(__dirname, "..", "uploads", relative);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch (e) {
    console.warn("safeUnlink warning:", e.message);
  }
};

/* =========================
   PUBLIC GET
========================= */

// GET /api/homepage/profile
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, title, description, updated_at FROM homepage_profile WHERE id=1 LIMIT 1"
    );
    res.json(rows[0] || null);
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/homepage/hero
exports.getHero = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, image, caption, order_number, is_active FROM homepage_hero WHERE is_active=1 ORDER BY order_number ASC, id ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("getHero error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/homepage/aims
exports.getAims = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, content, image, order_number, is_active FROM homepage_aims WHERE is_active=1 ORDER BY order_number ASC, id ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("getAims error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/homepage/vision-mission
exports.getVisionMission = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, vision_title, vision_text, mission_title, mission_text, image, updated_at FROM homepage_vision_mission WHERE id=1 LIMIT 1"
    );
    res.json(rows[0] || null);
  } catch (err) {
    console.error("getVisionMission error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   ADMIN WRITE
========================= */

// PUT /api/homepage/profile
exports.updateProfile = async (req, res) => {
  try {
    const { title, description } = req.body || {};

    if (!title || !description) {
      return res.status(400).json({
        message: "title & description wajib diisi",
      });
    }

    await db.query(
      "UPDATE homepage_profile SET title=?, description=? WHERE id=1",
      [title.trim(), description]
    );

    res.json({ message: "Profile homepage berhasil diupdate" });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/homepage/vision-mission
// upload.single("image")
exports.updateVisionMission = async (req, res) => {
  try {
    const {
      vision_title,
      vision_text,
      mission_title,
      mission_text,
    } = req.body || {};

    if (!vision_text || !mission_text) {
      return res.status(400).json({
        message: "vision_text & mission_text wajib diisi",
      });
    }

    const [oldRows] = await db.query(
      "SELECT image FROM homepage_vision_mission WHERE id=1 LIMIT 1"
    );

    const oldImage = oldRows[0]?.image || null;
    let image = oldImage;

    if (req.file?.filename) {
      image = visionDbPath(req.file.filename);
      safeUnlink(oldImage);
    }

    await db.query(
      `UPDATE homepage_vision_mission
       SET vision_title=?, vision_text=?, mission_title=?, mission_text=?, image=?
       WHERE id=1`,
      [
        (vision_title || "Vision").trim(),
        vision_text,
        (mission_title || "Mission").trim(),
        mission_text,
        image,
      ]
    );

    res.json({
      message: "Vision & Mission berhasil diupdate",
      image,
    });
  } catch (err) {
    console.error("updateVisionMission error:", err);

    if (req.file?.filename) {
      safeUnlink(visionDbPath(req.file.filename));
    }

    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   HERO CRUD (ADMIN)
========================= */

// GET /api/homepage/hero/admin
exports.getHeroAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, image, caption, order_number, is_active FROM homepage_hero ORDER BY order_number ASC, id ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("getHeroAdmin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/homepage/hero
exports.createHero = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File image wajib diupload" });
    }

    const { caption, order_number, is_active } = req.body || {};
    const image = heroDbPath(req.file.filename);

    await db.query(
      "INSERT INTO homepage_hero (image, caption, order_number, is_active) VALUES (?, ?, ?, ?)",
      [image, caption || null, toInt(order_number, 1), toInt(is_active, 1)]
    );

    res.json({ message: "Hero berhasil ditambahkan", image });
  } catch (err) {
    console.error("createHero error:", err);

    if (req.file?.filename) {
      safeUnlink(heroDbPath(req.file.filename));
    }

    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/homepage/hero/:id
exports.updateHero = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption, order_number, is_active } = req.body || {};

    const [oldRows] = await db.query(
      "SELECT image FROM homepage_hero WHERE id=?",
      [id]
    );

    if (oldRows.length === 0) {
      if (req.file?.filename) safeUnlink(heroDbPath(req.file.filename));
      return res.status(404).json({ message: "Hero tidak ditemukan" });
    }

    const oldImage = oldRows[0].image;
    let image = oldImage;

    if (req.file?.filename) {
      image = heroDbPath(req.file.filename);
      safeUnlink(oldImage);
    }

    await db.query(
      "UPDATE homepage_hero SET image=?, caption=?, order_number=?, is_active=? WHERE id=?",
      [image, caption ?? null, toInt(order_number, 1), toInt(is_active, 1), id]
    );

    res.json({ message: "Hero berhasil diupdate", image });
  } catch (err) {
    console.error("updateHero error:", err);

    if (req.file?.filename) {
      safeUnlink(heroDbPath(req.file.filename));
    }

    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/homepage/hero/:id
exports.deleteHero = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT image FROM homepage_hero WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Hero tidak ditemukan" });
    }

    const img = rows[0].image;

    await db.query("DELETE FROM homepage_hero WHERE id=?", [id]);
    safeUnlink(img);

    res.json({ message: "Hero berhasil dihapus" });
  } catch (err) {
    console.error("deleteHero error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   AIMS CRUD (ADMIN)
========================= */

// GET /api/homepage/aims/admin
exports.getAimsAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, content, image, order_number, is_active FROM homepage_aims ORDER BY order_number ASC, id ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("getAimsAdmin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/homepage/aims
exports.createAim = async (req, res) => {
  try {
    const { content, order_number, is_active } = req.body || {};

    if (!content) {
      return res.status(400).json({ message: "content wajib diisi" });
    }

    const image = req.file?.filename ? aimsDbPath(req.file.filename) : null;

    await db.query(
      "INSERT INTO homepage_aims (content, image, order_number, is_active) VALUES (?, ?, ?, ?)",
      [content, image, toInt(order_number, 1), toInt(is_active, 1)]
    );

    res.json({ message: "Aim berhasil ditambahkan", image });
  } catch (err) {
    console.error("createAim error:", err);

    if (req.file?.filename) {
      safeUnlink(aimsDbPath(req.file.filename));
    }

    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/homepage/aims/:id
exports.updateAim = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, order_number, is_active } = req.body || {};

    if (!content) {
      return res.status(400).json({ message: "content wajib diisi" });
    }

    const [oldRows] = await db.query(
      "SELECT image FROM homepage_aims WHERE id=?",
      [id]
    );

    if (oldRows.length === 0) {
      if (req.file?.filename) safeUnlink(aimsDbPath(req.file.filename));
      return res.status(404).json({ message: "Aim tidak ditemukan" });
    }

    const oldImage = oldRows[0].image;
    let image = oldImage;

    if (req.file?.filename) {
      image = aimsDbPath(req.file.filename);
      safeUnlink(oldImage);
    }

    await db.query(
      "UPDATE homepage_aims SET content=?, image=?, order_number=?, is_active=? WHERE id=?",
      [content, image, toInt(order_number, 1), toInt(is_active, 1), id]
    );

    res.json({ message: "Aim berhasil diupdate", image });
  } catch (err) {
    console.error("updateAim error:", err);

    if (req.file?.filename) {
      safeUnlink(aimsDbPath(req.file.filename));
    }

    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/homepage/aims/:id
exports.deleteAim = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT image FROM homepage_aims WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Aim tidak ditemukan" });
    }

    const img = rows[0].image;

    await db.query("DELETE FROM homepage_aims WHERE id=?", [id]);
    safeUnlink(img);

    res.json({ message: "Aim berhasil dihapus" });
  } catch (err) {
    console.error("deleteAim error:", err);
    res.status(500).json({ message: "Server error" });
  }
};