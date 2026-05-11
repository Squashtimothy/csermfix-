const db = require("../config/db");

/* =====================
   GET ALL NEWS
===================== */
exports.getAll = async (req, res) => {
  try {
    const { status } = req.query;

    let query = "SELECT * FROM news";
    let values = [];

    // FILTER STATUS
    if (status) {
      query += " WHERE status = ?";
      values.push(status);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await db.query(query, values);

    return res.status(200).json(rows);
  } catch (err) {
    console.error("GET NEWS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* =====================
   GET NEWS BY ID
===================== */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM news WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "News tidak ditemukan",
      });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("GET NEWS BY ID ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* =====================
   CREATE NEWS
===================== */
exports.create = async (req, res) => {
  try {
    console.log("========== CREATE NEWS ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      title,
      content,
      status,
    } = req.body || {};

    // VALIDASI
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title dan content wajib diisi",
      });
    }

    // IMAGE
    const image = req.file
      ? `news/${req.file.filename}`
      : null;

    console.log("IMAGE:", image);

    // INSERT DATABASE
    const [result] = await db.query(
      `
      INSERT INTO news
      (
        title,
        content,
        image,
        status
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        title,
        content,
        image,
        status || "published",
      ]
    );

    console.log("INSERT SUCCESS:", result);

    return res.status(201).json({
      success: true,
      message: "News berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (err) {
    console.error("========== CREATE NEWS ERROR ==========");
    console.error(err);
    console.error("BODY:", req.body);
    console.error("FILE:", req.file);

    return res.status(500).json({
      success: false,
      message: "CREATE NEWS ERROR",
      error: err.message,
    });
  }
};

/* =====================
   UPDATE NEWS
===================== */
exports.update = async (req, res) => {
  try {
    console.log("UPDATE BODY:", req.body);

    const { id } = req.params;

    const {
      title,
      content,
      status,
    } = req.body || {};

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID tidak ditemukan",
      });
    }

    let query = "UPDATE news SET";
    let values = [];
    let updates = [];

    // TITLE
    if (title) {
      updates.push("title=?");
      values.push(title);
    }

    // CONTENT
    if (content) {
      updates.push("content=?");
      values.push(content);
    }

    // STATUS
    if (status) {
      updates.push("status=?");
      values.push(status);
    }

    // IMAGE
    if (req.file) {
      updates.push("image=?");

      values.push(
        `news/${req.file.filename}`
      );
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada data yang diupdate",
      });
    }

    query +=
      " " +
      updates.join(", ") +
      " WHERE id=?";

    values.push(id);

    await db.query(query, values);

    return res.status(200).json({
      success: true,
      message: "News berhasil diupdate",
    });
  } catch (err) {
    console.error("UPDATE NEWS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* =====================
   UPDATE STATUS ONLY
===================== */
exports.updateStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(
      "UPDATE STATUS:",
      id,
      status
    );

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID tidak ditemukan",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status wajib diisi",
      });
    }

    await db.query(
      `
      UPDATE news
      SET status=?
      WHERE id=?
      `,
      [status, id]
    );

    return res.status(200).json({
      success: true,
      message: "Status news berhasil diupdate",
    });
  } catch (err) {
    console.error(
      "UPDATE STATUS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* =====================
   DELETE NEWS
===================== */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID tidak ditemukan",
      });
    }

    await db.query(
      "DELETE FROM news WHERE id=?",
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "News berhasil dihapus",
    });
  } catch (err) {
    console.error("DELETE NEWS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};