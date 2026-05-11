const db = require("../config/db");

/* =========================
   GET ALL NEWS
========================= */

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM news
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.log("GET ALL ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil news",
      error: err.message,
    });
  }
};

/* =========================
   GET DETAIL NEWS
========================= */

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("NEWS ID:", id);

    const [rows] = await db.query(
      `
      SELECT *
      FROM news
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    console.log("DETAIL RESULT:", rows);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "News tidak ditemukan",
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.log("DETAIL ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail news",
      error: err.message,
    });
  }
};

/* =========================
   CREATE NEWS
========================= */

exports.create = async (req, res) => {
  try {
    const { title, content } = req.body;

    let image = null;

    if (req.file) {
      image = `/uploads/news/${req.file.filename}`;
    }

    const [result] = await db.query(
      `
      INSERT INTO news
      (title, content, image)
      VALUES (?, ?, ?)
      `,
      [title, content, image]
    );

    res.status(201).json({
      success: true,
      message: "News berhasil dibuat",
      id: result.insertId,
    });
  } catch (err) {
    console.log("CREATE ERROR:", err);

    res.status(500).json({
      success: false,
      message: "CREATE NEWS ERROR",
      error: err.message,
    });
  }
};

/* =========================
   UPDATE NEWS
========================= */

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const [oldNews] = await db.query(
      `
      SELECT *
      FROM news
      WHERE id = ?
      `,
      [id]
    );

    if (oldNews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "News tidak ditemukan",
      });
    }

    let image = oldNews[0].image;

    if (req.file) {
      image = `/uploads/news/${req.file.filename}`;
    }

    await db.query(
      `
      UPDATE news
      SET
        title = ?,
        content = ?,
        image = ?
      WHERE id = ?
      `,
      [title, content, image, id]
    );

    res.json({
      success: true,
      message: "News berhasil diupdate",
    });
  } catch (err) {
    console.log("UPDATE ERROR:", err);

    res.status(500).json({
      success: false,
      message: "UPDATE NEWS ERROR",
      error: err.message,
    });
  }
};

/* =========================
   DELETE NEWS
========================= */

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      DELETE FROM news
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message: "News berhasil dihapus",
    });
  } catch (err) {
    console.log("DELETE ERROR:", err);

    res.status(500).json({
      success: false,
      message: "DELETE NEWS ERROR",
      error: err.message,
    });
  }
};