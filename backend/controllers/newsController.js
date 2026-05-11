const db = require("../config/db");

/* =========================
   VALID STATUS
========================= */

const VALID_STATUS = [
  "draft",
  "published",
];

/* =========================
   GET ALL NEWS
========================= */

exports.getAll = async (
  req,
  res
) => {
  try {
    const [rows] =
      await db.query(`
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
      "GET ALL NEWS ERROR:",
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

exports.getPublished =
  async (req, res) => {
    try {
      const [rows] =
        await db.query(`
        SELECT *
        FROM news
        WHERE status = 'published'
        ORDER BY created_at DESC
      `);

      return res
        .status(200)
        .json({
          success: true,
          data: rows,
        });
    } catch (err) {
      console.error(
        "GET PUBLISHED ERROR:",
        err
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Gagal mengambil published news",
          error:
            err.message,
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
    const { id } =
      req.params;

    if (!id) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "ID wajib diisi",
        });
    }

    const [rows] =
      await db.query(
        `
        SELECT *
        FROM news
        WHERE id = ?
      `,
        [id]
      );

    if (
      rows.length === 0
    ) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "News tidak ditemukan",
        });
    }

    return res
      .status(200)
      .json({
        success: true,
        data: rows[0],
      });
  } catch (err) {
    console.error(
      "GET NEWS BY ID ERROR:",
      err
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Gagal mengambil news",
        error:
          err.message,
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

    /* VALIDATION */

    if (
      !title ||
      !content
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Title dan content wajib diisi",
        });
    }

    let finalStatus =
      status ||
      "published";

    if (
      !VALID_STATUS.includes(
        finalStatus
      )
    ) {
      finalStatus =
        "draft";
    }

    /* IMAGE */

    let image = null;

    if (req.file) {
      image = `/uploads/news/${req.file.filename}`;
    }

    /* INSERT */

    const [result] =
      await db.query(
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
          finalStatus,
        ]
      );

    return res
      .status(201)
      .json({
        success: true,
        message:
          "News berhasil ditambahkan",
        data: {
          id: result.insertId,
          title,
          content,
          image,
          status:
            finalStatus,
        },
      });
  } catch (err) {
    console.error(
      "CREATE NEWS ERROR:",
      err
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "CREATE NEWS ERROR",
        error:
          err.message,
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
    const { id } =
      req.params;

    const {
      title,
      content,
      status,
    } = req.body;

    /* CHECK EXIST */

    const [rows] =
      await db.query(
        `
        SELECT *
        FROM news
        WHERE id = ?
      `,
        [id]
      );

    if (
      rows.length === 0
    ) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "News tidak ditemukan",
        });
    }

    const oldData =
      rows[0];

    /* IMAGE */

    let image =
      oldData.image;

    if (req.file) {
      image = `/uploads/news/${req.file.filename}`;
    }

    /* STATUS */

    let finalStatus =
      status ||
      oldData.status;

    if (
      !VALID_STATUS.includes(
        finalStatus
      )
    ) {
      finalStatus =
        oldData.status;
    }

    /* UPDATE */

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
        title ||
          oldData.title,
        content ||
          oldData.content,
        image,
        finalStatus,
        id,
      ]
    );

    return res
      .status(200)
      .json({
        success: true,
        message:
          "News berhasil diupdate",
      });
  } catch (err) {
    console.error(
      "UPDATE NEWS ERROR:",
      err
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "UPDATE NEWS ERROR",
        error:
          err.message,
      });
  }
};

/* =========================
   UPDATE STATUS
========================= */

exports.updateStatus =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const {
        status,
      } = req.body;

      if (
        !VALID_STATUS.includes(
          status
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Status tidak valid",
          });
      }

      const [rows] =
        await db.query(
          `
        SELECT *
        FROM news
        WHERE id = ?
      `,
          [id]
        );

      if (
        rows.length === 0
      ) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "News tidak ditemukan",
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
        "STATUS ERROR:",
        err
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Gagal update status",
          error:
            err.message,
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
    const { id } =
      req.params;

    const [rows] =
      await db.query(
        `
        SELECT *
        FROM news
        WHERE id = ?
      `,
        [id]
      );

    if (
      rows.length === 0
    ) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "News tidak ditemukan",
        });
    }

    await db.query(
      `
      DELETE FROM news
      WHERE id = ?
    `,
      [id]
    );

    return res
      .status(200)
      .json({
        success: true,
        message:
          "News berhasil dihapus",
      });
  } catch (err) {
    console.error(
      "DELETE ERROR:",
      err
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Gagal menghapus news",
        error:
          err.message,
      });
  }
};