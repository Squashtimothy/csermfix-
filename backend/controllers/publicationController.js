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

    const archived =
      req.query.archived === "true";

    let orderBy = "year DESC";

    if (sort === "year_asc") {
      orderBy = "year ASC";
    }

    const searchQuery = `%${search}%`;

    /* =========================
       MAIN QUERY
    ========================= */

    const sql = `
      SELECT *
      FROM publications
      WHERE
        archived = ?
        AND (
          title LIKE ?
          OR authors LIKE ?
          OR journal LIKE ?
          OR doi LIKE ?
        )
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const values = [
      archived ? 1 : 0,
      searchQuery,
      searchQuery,
      searchQuery,
      searchQuery,
      limit,
      offset,
    ];

    const [rows] = await db.query(sql, values);

    /* =========================
       COUNT QUERY
    ========================= */

    const [countRows] = await db.query(
      `
      SELECT COUNT(*) as total
      FROM publications
      WHERE
        archived = ?
        AND (
          title LIKE ?
          OR authors LIKE ?
          OR journal LIKE ?
          OR doi LIKE ?
        )
      `,
      [
        archived ? 1 : 0,
        searchQuery,
        searchQuery,
        searchQuery,
        searchQuery,
      ]
    );

    const total = countRows[0].total;

    res.json({
      data: rows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("GET PUBLICATIONS ERROR:", err);

    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

/* =========================
   CREATE
========================= */

exports.createPublication = async (req, res) => {
  try {
    const {
      title,
      authors,
      year,
      journal,
      url,
      doi,
      keywords,
      isBold,
    } = req.body || {};

    if (!title || !authors || !year || !url) {
      return res.status(400).json({
        message:
          "title, authors, year, url wajib diisi",
      });
    }

    await db.query(
      `
      INSERT INTO publications
      (
        title,
        authors,
        year,
        journal,
        url,
        doi,
        keywords,
        is_bold,
        archived
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
      `,
      [
        title,
        authors,
        year,
        journal || null,
        url,
        doi || null,
        keywords || null,
        isBold ? 1 : 0,
      ]
    );

    res.json({
      message:
        "Publication berhasil ditambahkan",
    });
  } catch (err) {
    console.error(
      "CREATE PUBLICATION ERROR:",
      err
    );

    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

/* =========================
   UPDATE
========================= */

exports.updatePublication = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      authors,
      year,
      journal,
      url,
      doi,
      keywords,
      isBold,
    } = req.body || {};

    const [rows] = await db.query(
      "SELECT id FROM publications WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message:
          "Publication tidak ditemukan",
      });
    }

    await db.query(
      `
      UPDATE publications
      SET
        title = ?,
        authors = ?,
        year = ?,
        journal = ?,
        url = ?,
        doi = ?,
        keywords = ?,
        is_bold = ?
      WHERE id = ?
      `,
      [
        title,
        authors,
        year,
        journal || null,
        url,
        doi || null,
        keywords || null,
        isBold ? 1 : 0,
        id,
      ]
    );

    res.json({
      message:
        "Publication berhasil diupdate",
    });
  } catch (err) {
    console.error(
      "UPDATE PUBLICATION ERROR:",
      err
    );

    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

/* =========================
   DELETE
========================= */

exports.deletePublication = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM publications WHERE id = ?",
      [id]
    );

    res.json({
      message:
        "Publication berhasil dihapus",
    });
  } catch (err) {
    console.error(
      "DELETE PUBLICATION ERROR:",
      err
    );

    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

/* =========================
   ARCHIVE
========================= */

exports.archivePublication = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      UPDATE publications
      SET archived = 1
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      message:
        "Publication berhasil diarchive",
    });
  } catch (err) {
    console.error(
      "ARCHIVE PUBLICATION ERROR:",
      err
    );

    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

/* =========================
   RESTORE
========================= */

exports.restorePublication = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      UPDATE publications
      SET archived = 0
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      message:
        "Publication berhasil direstore",
    });
  } catch (err) {
    console.error(
      "RESTORE PUBLICATION ERROR:",
      err
    );

    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};