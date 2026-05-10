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
      req.query.archived === "true" ? 1 : 0;

    let orderBy = "year DESC";

    if (sort === "year_asc") {
      orderBy = "year ASC";
    }

    const searchQuery = `%${search}%`;

    const [rows] = await db.query(
      `
      SELECT *
      FROM publications
      WHERE archived = ?
      AND (
        title LIKE ?
        OR authors LIKE ?
        OR journal LIKE ?
        OR doi LIKE ?
        OR keywords LIKE ?
      )
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
      `,
      [
        archived,
        searchQuery,
        searchQuery,
        searchQuery,
        searchQuery,
        searchQuery,
        limit,
        offset,
      ]
    );

    const [countRows] = await db.query(
      `
      SELECT COUNT(*) as total
      FROM publications
      WHERE archived = ?
      AND (
        title LIKE ?
        OR authors LIKE ?
        OR journal LIKE ?
        OR doi LIKE ?
        OR keywords LIKE ?
      )
      `,
      [
        archived,
        searchQuery,
        searchQuery,
        searchQuery,
        searchQuery,
        searchQuery,
      ]
    );

    const total = countRows[0].total;

    const totalPages = Math.ceil(total / limit);

    return res.json({
      data: rows,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    });

  } catch (err) {

    console.error(
      "GET PUBLICATIONS ERROR:",
      err
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* =========================
   CREATE PUBLICATION
========================= */

exports.createPublication = async (
  req,
  res
) => {
  try {
    const {
      title,
      authors,
      year,
      journal,
      url,
      doi,
      keywords,
    } = req.body || {};

    if (!title || !authors || !year) {
      return res.status(400).json({
        message:
          "title, authors, dan year wajib diisi",
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
        archived
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
      `,
      [
        title,
        authors,
        year,
        journal || null,
        url || null,
        doi || null,
        keywords || null,
      ]
    );

    return res.json({
      message:
        "Publication berhasil ditambahkan",
    });

  } catch (err) {

    console.error(
      "CREATE PUBLICATION ERROR:",
      err
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* =========================
   UPDATE PUBLICATION
========================= */

exports.updatePublication = async (
  req,
  res
) => {
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
    } = req.body || {};

    const [check] = await db.query(
      "SELECT id FROM publications WHERE id = ?",
      [id]
    );

    if (check.length === 0) {
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
        keywords = ?
      WHERE id = ?
      `,
      [
        title,
        authors,
        year,
        journal || null,
        url || null,
        doi || null,
        keywords || null,
        id,
      ]
    );

    return res.json({
      message:
        "Publication berhasil diupdate",
    });

  } catch (err) {

    console.error(
      "UPDATE PUBLICATION ERROR:",
      err
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* =========================
   DELETE PUBLICATION
========================= */

exports.deletePublication = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const [check] = await db.query(
      "SELECT id FROM publications WHERE id = ?",
      [id]
    );

    if (check.length === 0) {
      return res.status(404).json({
        message:
          "Publication tidak ditemukan",
      });
    }

    await db.query(
      `
      DELETE FROM publications
      WHERE id = ?
      `,
      [id]
    );

    return res.json({
      message:
        "Publication berhasil dihapus",
    });

  } catch (err) {

    console.error(
      "DELETE PUBLICATION ERROR:",
      err
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* =========================
   ARCHIVE PUBLICATION
========================= */

exports.archivePublication = async (
  req,
  res
) => {
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

    return res.json({
      message:
        "Publication berhasil diarchive",
    });

  } catch (err) {

    console.error(
      "ARCHIVE PUBLICATION ERROR:",
      err
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* =========================
   RESTORE PUBLICATION
========================= */

exports.restorePublication = async (
  req,
  res
) => {
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

    return res.json({
      message:
        "Publication berhasil direstore",
    });

  } catch (err) {

    console.error(
      "RESTORE PUBLICATION ERROR:",
      err
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};