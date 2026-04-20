const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  try {
    const username = (req.body?.username || "").trim();
    const password = req.body?.password || "";

    if (!username || !password) {
      return res.status(400).json({ message: "Username dan password wajib diisi" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT_SECRET belum diset di environment" });
    }

    const [rows] = await db.query(
      "SELECT id, username, password, role FROM admins WHERE username = ? LIMIT 1",
      [username]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    const user = rows[0];

    if (!user.password || typeof user.password !== "string") {
      return res.status(500).json({ message: "Password user di database kosong/invalid" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: "1d" });

    return res.status(200).json({
      message: "Login berhasil",
      token,
      role: user.role,
    });
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    return res.status(500).json({ message: "Terjadi kesalahan saat login" });
  }
}

async function createAdmin(req, res) {
  try {
    const username = (req.body?.username || "").trim();
    const password = req.body?.password || "";
    const role = (req.body?.role || "").trim();

    if (!username || !password || !role) {
      return res.status(400).json({ message: "username, password, dan role wajib diisi" });
    }

    const allowedRoles = ["admin", "superadmin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: `Role tidak valid. Gunakan: ${allowedRoles.join(", ")}` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO admins (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role]
    );

    return res.status(201).json({
      message: "User berhasil ditambahkan",
      id: result?.insertId,
    });
  } catch (e) {
    if (e?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Username sudah digunakan" });
    }
    console.error("CREATE ADMIN ERROR:", e);
    return res.status(500).json({ message: "Terjadi kesalahan saat membuat admin" });
  }
}

module.exports = { login, createAdmin };
