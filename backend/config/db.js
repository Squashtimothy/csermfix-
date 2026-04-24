const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, // 🔥 penting untuk Railway
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// DEBUG ENV (biar tau kebaca atau tidak)
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

// Test koneksi (JANGAN bikin crash)
(async () => {
  try {
    const connection = await db.getConnection();
    console.log(" MySQL Connected...");
    connection.release();
  } catch (err) {
    console.error(" MySQL connection failed:", err.message);

  }
})();

module.exports = db;