const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =========================
   LOGIN
========================= */

async function login(req, res) {
  try {
    console.log("=== login request ===");

    const username = (req.body?.username || "").trim();
    const password = req.body?.password || "";

    console.log("BODY:", req.body);
    console.log("USERNAME:", username);

    // VALIDASI INPUT
    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi",
      });
    }

    // CHECK JWT
    const secret = process.env.JWT_SECRET;

    console.log("JWT_SECRET:", secret ? "ADA" : "TIDAK ADA");

    if (!secret) {
      return res.status(500).json({
        message: "JWT_SECRET belum diset di environment",
      });
    }

    // QUERY USER
    console.log("DB QUERY START");

    const [rows] = await db.query(
      "SELECT id, username, password, role FROM admins WHERE username = ? LIMIT 1",
      [username]
    );

    console.log("DB RESULT:", rows);

    // USER TIDAK ADA
    if (!rows || rows.length === 0) {
      return res.status(401).json({
        message: "User tidak ditemukan",
      });
    }

    const user = rows[0];

    console.log("USER FOUND:", user.username);
    console.log("HASH PASSWORD:", user.password);

    // VALIDASI PASSWORD DB
    if (!user.password || typeof user.password !== "string") {
      return res.status(500).json({
        message: "Password user di database kosong/invalid",
      });
    }

    // CHECK PASSWORD
    console.log("COMPARE PASSWORD START");

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("COMPARE RESULT:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Password salah",
      });
    }

    // GENERATE TOKEN
    console.log("GENERATE TOKEN");

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      secret,
      {
        expiresIn: "1d",
      }
    );

    console.log("LOGIN SUCCESS");

    return res.status(200).json({
      message: "Login berhasil",
      token,
      role: user.role,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (e) {
    console.error("LOGIN ERROR:", e);

    return res.status(500).json({
      message: "Terjadi kesalahan saat login",
      error: e.message,
    });
  }
}

/* =========================
   CREATE ADMIN
========================= */

async function createAdmin(req, res) {
  try {
    const username = (req.body?.username || "").trim();
    const password = req.body?.password || "";
    const role = (req.body?.role || "").trim();

    console.log("CREATE ADMIN BODY:", req.body);

    // VALIDASI
    if (!username || !password || !role) {
      return res.status(400).json({
        message: "username, password, dan role wajib diisi",
      });
    }

    const allowedRoles = ["admin", "superadmin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: `Role tidak valid. Gunakan: ${allowedRoles.join(", ")}`,
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("HASH GENERATED");

    // INSERT USER
    const [result] = await db.query(
      "INSERT INTO admins (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role]
    );

    console.log("ADMIN CREATED:", result);

    return res.status(201).json({
      message: "User berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (e) {
    console.error("CREATE ADMIN ERROR:", e);

    if (e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Username sudah digunakan",
      });
    }

    return res.status(500).json({
      message: "Terjadi kesalahan saat membuat admin",
      error: e.message,
    });
  }
}

module.exports = {
  login,
  createAdmin,
};