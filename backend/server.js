process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT ERROR:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load ENV
dotenv.config();

const app = express();

/* ======================
   DEBUG ENV
====================== */
console.log("PORT:", process.env.PORT);
console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);

/* ======================
   DB CONNECTION TEST
====================== */
const db = require("./config/db");

(async () => {
  try {
    const [rows] = await db.query("SHOW TABLES");
    console.log("DB CONNECTED SUCCESSFULLY");
    console.log("Tables:", rows);
  } catch (err) {
    console.error("DB CONNECTION FAILED:(:", err.message);
  }
})();

/* ======================
   MIDDLEWARE
====================== */

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["*"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ======================
   ROUTES
====================== */

const authRoutes = require("./routes/authRoutes.js");
const newsRoutes = require("./routes/newsRoutes.js");
const teamRoutes = require("./routes/teamRoutes.js");
const publicationRoutes = require("./routes/publicationRoutes.js");
const homepageRoutes = require("./routes/homepageRoutes.js");
const projectRoutes = require("./routes/projectRoutes.js");

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/homepage", homepageRoutes);
app.use("/api/projects", projectRoutes);

/* ======================
   HEALTH CHECK
====================== */

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running smoothly",
    status: "ok",
    port: process.env.PORT,
  });
});

/* ======================
   404 HANDLER
====================== */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ======================
   GLOBAL ERROR HANDLER
====================== */

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "File terlalu besar (maks 2MB)",
    });
  }

  return res.status(500).json({
    message: err.message || "Server error",
  });
});

/* ======================
   GRACEFUL SHUTDOWN
====================== */

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  process.exit(0);
});

/* ======================
   START SERVER
====================== */

const PORT = process.env.PORT || 5000;

// Railway wajib pakai 0.0.0.0
app.listen(PORT, "0.0.0.0", () => {
  console.log(` Server running on port ${PORT}`);
});