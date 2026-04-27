const db = require("../config/db");

/* =========================
   HELPERS
========================= */
const toInt = (v, def = 1) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

/* =========================
   GET PUBLICATIONS
========================= */
exports.getPublications = async (req, res) => {
  try {
    const page = toInt(req.query.page, 1);
    const limit = toInt(req.query.limit, 10);
    const offset = (page - 1) * limit;

    const search = req.query.search || "";
    const sort = req.query.sort || "year_desc";

    let orderBy = "year DESC";
    if (sort === "year_asc") orderBy = "year ASC";

    const searchQuery = `%${search}%`;

    const [rows] = await db.query(
      `SELECT *
       FROM publications
       WHERE 
         title LIKE ? OR
         authors LIKE ? OR
         journal LIKE ? OR
         doi LIKE ?
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [
        searchQuery,
        searchQuery,
        searchQuery,
        searchQuery,
        limit,
        offset,
      ]
    );

    const [countRows] = await db.query(
      `SELECT COUNT(*) as total
       FROM publications
       WHERE 
         title LIKE ? OR
         authors LIKE ? OR
         journal LIKE ? OR
         doi LIKE ?`,
      [searchQuery, searchQuery, searchQuery, searchQuery]
    );

    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: rows,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (err) {
    console.error("getPublications error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   CREATE
========================= */
exports.createPublication = async (req, res) => {
  try {
    const { title, authors, year, journal, url, doi } = req.body || {};

    if (!title || !authors || !year || !url) {
      return res.status(400).json({
        message: "title, authors, year, url wajib diisi",
      });
    }

    await db.query(
      `INSERT INTO publications
       (title, authors, year, journal, url, doi)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        authors,
        year,
        journal || null,
        url,
        doi || null,
      ]
    );

    res.json({ message: "Publication berhasil ditambahkan" });
  } catch (err) {
    console.error("createPublication error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPDATE
========================= */
exports.updatePublication = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, authors, year, journal, url, doi } = req.body || {};

    const [rows] = await db.query(
      "SELECT id FROM publications WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Publication tidak ditemukan" });
    }

    await db.query(
      `UPDATE publications SET
        title = ?,
        authors = ?,
        year = ?,
        journal = ?,
        url = ?,
        doi = ?
       WHERE id = ?`,
      [
        title,
        authors,
        year,
        journal || null,
        url,
        doi || null,
        id,
      ]
    );

    res.json({ message: "Publication berhasil diupdate" });
  } catch (err) {
    console.error("updatePublication error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   DELETE
========================= */
exports.deletePublication = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT id FROM publications WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Publication tidak ditemukan" });
    }

    await db.query("DELETE FROM publications WHERE id = ?", [id]);

    res.json({ message: "Publication berhasil dihapus" });
  } catch (err) {
    console.error("deletePublication error:", err);
    res.status(500).json({ message: "Server error" });
  }
};