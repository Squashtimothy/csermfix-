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

const projectDbPath = (filename) => `projects/${filename}`;

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
   PROJECT PAGE SETTINGS
========================= */

// GET /api/projects/page-settings
exports.getProjectPageSettings = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, hero_image, page_title, page_subtitle, updated_at
       FROM project_page_settings
       WHERE id = 1
       LIMIT 1`
    );

    res.json(rows[0] || null);
  } catch (err) {
    console.error("getProjectPageSettings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/projects/page-settings
exports.updateProjectPageSettings = async (req, res) => {
  try {
    const { page_title, page_subtitle } = req.body || {};

    const [oldRows] = await db.query(
      "SELECT hero_image FROM project_page_settings WHERE id = 1 LIMIT 1"
    );

    const oldImage = oldRows[0]?.hero_image || null;
    let hero_image = oldImage;

    if (req.file?.filename) {
      hero_image = projectDbPath(req.file.filename);
      safeUnlink(oldImage);
    }

    await db.query(
      `UPDATE project_page_settings
       SET page_title = ?, page_subtitle = ?, hero_image = ?
       WHERE id = 1`,
      [page_title || "Recent Project", page_subtitle || null, hero_image]
    );

    res.json({
      message: "Project page settings berhasil diupdate",
      hero_image,
    });
  } catch (err) {
    console.error("updateProjectPageSettings error:", err);

    if (req.file?.filename) {
      safeUnlink(projectDbPath(req.file.filename));
    }

    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   PROJECTS - PUBLIC
========================= */

// GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, title, slug, short_description, full_description, external_link,
              featured_image, location, project_date, is_featured, is_active, order_number,
              created_at, updated_at
       FROM projects
       WHERE is_active = 1
       ORDER BY is_featured DESC, order_number ASC, id ASC`
    );

    res.json(rows);
  } catch (err) {
    console.error("getProjects error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/projects/featured
exports.getFeaturedProject = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, title, slug, short_description, full_description, external_link,
              featured_image, location, project_date, is_featured, is_active, order_number,
              created_at, updated_at
       FROM projects
       WHERE is_featured = 1 AND is_active = 1
       ORDER BY order_number ASC, id ASC
       LIMIT 1`
    );

    res.json(rows[0] || null);
  } catch (err) {
    console.error("getFeaturedProject error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/projects/:id
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT id, title, slug, short_description, full_description, external_link,
              featured_image, location, project_date, is_featured, is_active, order_number,
              created_at, updated_at
       FROM projects
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Project tidak ditemukan" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("getProjectById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   PROJECTS - ADMIN
========================= */

// GET /api/projects/admin/all
exports.getProjectsAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, title, slug, short_description, full_description, external_link,
              featured_image, location, project_date, is_featured, is_active, order_number,
              created_at, updated_at
       FROM projects
       ORDER BY is_featured DESC, order_number ASC, id ASC`
    );

    res.json(rows);
  } catch (err) {
    console.error("getProjectsAdmin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      slug,
      short_description,
      full_description,
      external_link,
      location,
      project_date,
      is_featured,
      is_active,
      order_number,
    } = req.body || {};

    if (!title || !short_description) {
      return res.status(400).json({
        message: "title dan short_description wajib diisi",
      });
    }

    const featured_image = req.file?.filename
      ? projectDbPath(req.file.filename)
      : null;

    await db.query(
      `INSERT INTO projects
       (title, slug, short_description, full_description, external_link, featured_image, location, project_date, is_featured, is_active, order_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        slug || null,
        short_description,
        full_description || null,
        external_link || null,
        featured_image,
        location || null,
        project_date || null,
        toInt(is_featured, 0),
        toInt(is_active, 1),
        toInt(order_number, 1),
      ]
    );

    res.json({
      message: "Project berhasil ditambahkan",
      featured_image,
    });
  } catch (err) {
    console.error("createProject error:", err);

    if (req.file?.filename) {
      safeUnlink(projectDbPath(req.file.filename));
    }

    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/projects/:id
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      short_description,
      full_description,
      external_link,
      location,
      project_date,
      is_featured,
      is_active,
      order_number,
    } = req.body || {};

    if (!title || !short_description) {
      return res.status(400).json({
        message: "title dan short_description wajib diisi",
      });
    }

    const [oldRows] = await db.query(
      "SELECT featured_image FROM projects WHERE id = ?",
      [id]
    );

    if (oldRows.length === 0) {
      if (req.file?.filename) safeUnlink(projectDbPath(req.file.filename));
      return res.status(404).json({ message: "Project tidak ditemukan" });
    }

    const oldImage = oldRows[0].featured_image;
    let featured_image = oldImage;

    if (req.file?.filename) {
      featured_image = projectDbPath(req.file.filename);
      safeUnlink(oldImage);
    }

    await db.query(
      `UPDATE projects
       SET title = ?, slug = ?, short_description = ?, full_description = ?, external_link = ?,
           featured_image = ?, location = ?, project_date = ?, is_featured = ?, is_active = ?, order_number = ?
       WHERE id = ?`,
      [
        title.trim(),
        slug || null,
        short_description,
        full_description || null,
        external_link || null,
        featured_image,
        location || null,
        project_date || null,
        toInt(is_featured, 0),
        toInt(is_active, 1),
        toInt(order_number, 1),
        id,
      ]
    );

    res.json({
      message: "Project berhasil diupdate",
      featured_image,
    });
  } catch (err) {
    console.error("updateProject error:", err);

    if (req.file?.filename) {
      safeUnlink(projectDbPath(req.file.filename));
    }

    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const [projectRows] = await db.query(
      "SELECT featured_image FROM projects WHERE id = ?",
      [id]
    );

    if (projectRows.length === 0) {
      return res.status(404).json({ message: "Project tidak ditemukan" });
    }

    const featuredImage = projectRows[0].featured_image;

    const [blockRows] = await db.query(
      "SELECT image FROM project_blocks WHERE project_id = ?",
      [id]
    );

    await db.query("DELETE FROM projects WHERE id = ?", [id]);

    safeUnlink(featuredImage);
    for (const block of blockRows) {
      safeUnlink(block.image);
    }

    res.json({ message: "Project berhasil dihapus" });
  } catch (err) {
    console.error("deleteProject error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   PROJECT BLOCKS - PUBLIC
========================= */

// GET /api/projects/:projectId/blocks
exports.getProjectBlocks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const [rows] = await db.query(
      `SELECT id, project_id, title, content, image, layout_type, image_style, order_number, is_active,
              created_at, updated_at
       FROM project_blocks
       WHERE project_id = ? AND is_active = 1
       ORDER BY order_number ASC, id ASC`,
      [projectId]
    );

    res.json(rows);
  } catch (err) {
    console.error("getProjectBlocks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   PROJECT BLOCKS - ADMIN
========================= */

// GET /api/projects/:projectId/blocks/admin
exports.getProjectBlocksAdmin = async (req, res) => {
  try {
    const { projectId } = req.params;

    const [rows] = await db.query(
      `SELECT id, project_id, title, content, image, layout_type, image_style, order_number, is_active,
              created_at, updated_at
       FROM project_blocks
       WHERE project_id = ?
       ORDER BY order_number ASC, id ASC`,
      [projectId]
    );

    res.json(rows);
  } catch (err) {
    console.error("getProjectBlocksAdmin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/projects/:projectId/blocks
exports.createProjectBlock = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      title,
      content,
      layout_type,
      image_style,
      order_number,
      is_active,
    } = req.body || {};

    if (!content) {
      return res.status(400).json({ message: "content wajib diisi" });
    }

    const [projectRows] = await db.query(
      "SELECT id FROM projects WHERE id = ? LIMIT 1",
      [projectId]
    );

    if (projectRows.length === 0) {
      if (req.file?.filename) safeUnlink(projectDbPath(req.file.filename));
      return res.status(404).json({ message: "Project tidak ditemukan" });
    }

    const image = req.file?.filename ? projectDbPath(req.file.filename) : null;

    await db.query(
      `INSERT INTO project_blocks
       (project_id, title, content, image, layout_type, image_style, order_number, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        title || null,
        content,
        image,
        layout_type || "text-left-image-right",
        image_style || "rounded-2xl",
        toInt(order_number, 1),
        toInt(is_active, 1),
      ]
    );

    res.json({
      message: "Project block berhasil ditambahkan",
      image,
    });
  } catch (err) {
    console.error("createProjectBlock error:", err);

    if (req.file?.filename) {
      safeUnlink(projectDbPath(req.file.filename));
    }

    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/projects/blocks/:id
exports.updateProjectBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      layout_type,
      image_style,
      order_number,
      is_active,
    } = req.body || {};

    if (!content) {
      return res.status(400).json({ message: "content wajib diisi" });
    }

    const [oldRows] = await db.query(
      "SELECT image FROM project_blocks WHERE id = ?",
      [id]
    );

    if (oldRows.length === 0) {
      if (req.file?.filename) safeUnlink(projectDbPath(req.file.filename));
      return res.status(404).json({ message: "Project block tidak ditemukan" });
    }

    const oldImage = oldRows[0].image;
    let image = oldImage;

    if (req.file?.filename) {
      image = projectDbPath(req.file.filename);
      safeUnlink(oldImage);
    }

    await db.query(
      `UPDATE project_blocks
       SET title = ?, content = ?, image = ?, layout_type = ?, image_style = ?, order_number = ?, is_active = ?
       WHERE id = ?`,
      [
        title || null,
        content,
        image,
        layout_type || "text-left-image-right",
        image_style || "rounded-2xl",
        toInt(order_number, 1),
        toInt(is_active, 1),
        id,
      ]
    );

    res.json({
      message: "Project block berhasil diupdate",
      image,
    });
  } catch (err) {
    console.error("updateProjectBlock error:", err);

    if (req.file?.filename) {
      safeUnlink(projectDbPath(req.file.filename));
    }

    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/projects/blocks/:id
exports.deleteProjectBlock = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT image FROM project_blocks WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Project block tidak ditemukan" });
    }

    const img = rows[0].image;

    await db.query("DELETE FROM project_blocks WHERE id = ?", [id]);
    safeUnlink(img);

    res.json({ message: "Project block berhasil dihapus" });
  } catch (err) {
    console.error("deleteProjectBlock error:", err);
    res.status(500).json({ message: "Server error" });
  }
};