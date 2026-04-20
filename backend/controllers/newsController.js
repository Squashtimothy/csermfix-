const db = require("../config/db");

// =====================
// GET semua news
// =====================
exports.getAll = async (req, res) => {
  try {
    const { status } = req.query;

    let query = "SELECT * FROM news";
    let values = [];

    // ✅ FILTER STATUS (untuk user)
    if (status) {
      query += " WHERE status = ?";
      values.push(status);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await db.query(query, values);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================
// GET news by id
// =====================
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM news WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "News tidak ditemukan" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================
// CREATE news
// =====================
exports.create = async (req, res) => {
  try {
    const { title, content, status } = req.body || {};

    if (!title || !content) {
      return res.status(400).json({ message: "Title dan content wajib" });
    }

    const image = req.file ? `news/${req.file.filename}` : null;

    await db.query(
      "INSERT INTO news (title, content, image, status) VALUES (?, ?, ?, ?)",
      [title, content, image, status || "published"] // ✅ default
    );

    res.json({ message: "News berhasil ditambahkan" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================
// UPDATE news
// =====================
exports.update = async (req, res) => {
  try {
    console.log("BODY MASUK:", req.body);
    const { id } = req.params;
    const { title, content, status } = req.body || {};

    if (!id) {
      return res.status(400).json({ message: "ID tidak ditemukan" });
    }

    let query = "UPDATE news SET";
    let values = [];
    let updates = [];

    // ✅ fleksibel (tidak wajib semua field)
    if (title) {
      updates.push("title=?");
      values.push(title);
    }

    if (content) {
      updates.push("content=?");
      values.push(content);
    }

    if (status) {
      updates.push("status=?");
      values.push(status);
    }

    if (req.file) {
      updates.push("image=?");
      values.push(`news/${req.file.filename}`);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "Tidak ada data yang diupdate" });
    }

    query += " " + updates.join(", ") + " WHERE id=?";
    values.push(id);

    await db.query(query, values);

    res.json({ message: "News berhasil diupdate" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================
// DELETE news
// =====================
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID tidak ditemukan" });
    }

    await db.query("DELETE FROM news WHERE id=?", [id]);

    res.json({ message: "News berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};