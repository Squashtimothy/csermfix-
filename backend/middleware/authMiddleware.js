const jwt = require("jsonwebtoken");

/* =========================
   VERIFY TOKEN
========================= */

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    // TOKEN TIDAK ADA
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan",
      });
    }

    // FORMAT TOKEN HARUS: Bearer xxx
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Format token salah",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token kosong",
      });
    }

    // VERIFY JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("TOKEN DECODED:", decoded);

    req.user = decoded;

    next();
  } catch (err) {
    console.error("VERIFY TOKEN ERROR:", err);

    return res.status(401).json({
      success: false,
      message: "Token tidak valid",
      error: err.message,
    });
  }
};

/* =========================
   IS ADMIN
========================= */

const isAdmin = (req, res, next) => {
  try {
    console.log("USER:", req.user);

    if (
      req.user?.role !== "admin" &&
      req.user?.role !== "superadmin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak",
      });
    }

    next();
  } catch (err) {
    console.error("IS ADMIN ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Middleware admin error",
    });
  }
};

/* =========================
   IS SUPER ADMIN
========================= */

const isSuperAdmin = (
  req,
  res,
  next
) => {
  try {
    if (
      req.user?.role !==
      "superadmin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak",
      });
    }

    next();
  } catch (err) {
    console.error(
      "SUPER ADMIN ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Middleware super admin error",
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isSuperAdmin,
};