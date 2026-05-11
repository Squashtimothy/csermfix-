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

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error(
      "GET NEWS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil news",
      error: err.message,
    });
  }
};

/* =========================
   GET PUBLISHED NEWS
========================= */
exports.getPublished = async (
  req,
  res
) => {
  try {
    const [rows] = await db.query(
      `
      SELECT *
      FROM news
      WHERE status = 'published'
      ORDER BY created_at DESC
      `
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error(
      "GET PUBLISHED NEWS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil published news",
      error: err.message,
    });
  }
};

/* =========================
   GET NEWS BY ID
========================= */
exports.getById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM news
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "News tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error(
      "GET NEWS BY ID ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil news",
      error: err.message,
    });
  }
};

/* =========================
   CREATE NEWS
========================= */
exports.create = async (
  req,
  res
) => {
  try {
    console.log(
      "BODY:",
      req.body
    );

    console.log(
      "FILE:",
      req.file
    );

    const {
      title,
      content,
      status,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message:
          "Title dan content wajib diisi",
      });
    }

    // IMAGE
    let image = null;

    if (req.file) {
      image = `/uploads/news/${req.file.filename}`;
    }

    // INSERT
    const [result] = await db.query(
      `
      INSERT INTO news
      (title, content, image, status)
      VALUES (?, ?, ?, ?)
      `,
      [
        title,
        content,
        image,
        status || "published",
      ]
    );

    console.log(
      "NEWS CREATED:",
      result
    );

    return res.status(201).json({
      success: true,
      message:
        "News berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (err) {
    console.error(
      "CREATE NEWS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "CREATE NEWS ERROR",
      error: err.message,
    });
  }
};

/* =========================
   UPDATE NEWS
========================= */
exports.update = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      title,
      content,
      status,
    } = req.body;

    let image = null;

    if (req.file) {
      image = `/uploads/news/${req.file.filename}`;
    }

    // GET OLD DATA
    const [oldData] = await db.query(
      `
      SELECT *
      FROM news
      WHERE id = ?
      `,
      [id]
    );

    if (oldData.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "News tidak ditemukan",
      });
    }

    const oldNews = oldData[0];

    await db.query(
      `
      UPDATE news
      SET
        title = ?,
        content = ?,
        image = ?,
        status = ?
      WHERE id = ?
      `,
      [
        title || oldNews.title,
        content || oldNews.content,
        image || oldNews.image,
        status || oldNews.status,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message:
        "News berhasil diupdate",
    });
  } catch (err) {
    console.error(
      "UPDATE NEWS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal update news",
      error: err.message,
    });
  }
};

/* =========================
   UPDATE STATUS
========================= */
exports.updateStatus =
  async (req, res) => {
    try {
      const { id } = req.params;

      const { status } =
        req.body;

      if (!status) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Status wajib diisi",
          });
      }

      await db.query(
        `
      UPDATE news
      SET status = ?
      WHERE id = ?
      `,
        [status, id]
      );

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Status berhasil diupdate",
        });
    } catch (err) {
      console.error(
        "UPDATE STATUS ERROR:",
        err
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Gagal update status",
          error: err.message,
        });
    }
  };

/* =========================
   DELETE NEWS
========================= */
exports.remove = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      DELETE FROM news
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      message:
        "News berhasil dihapus",
    });
  } catch (err) {
    console.error(
      "DELETE NEWS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal menghapus news",
      error: err.message,
    });
  }
};