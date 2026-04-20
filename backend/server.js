const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

/* ======================
   MIDDLEWARE
====================== */

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : "*",
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

// WAJIB pakai .js supaya pasti file yang benar
const authRoutes = require("./routes/authRoutes.js");
const newsRoutes = require("./routes/newsRoutes.js");
const teamRoutes = require("./routes/teamRoutes.js");
const publicationRoutes = require("./routes/publicationRoutes.js");
const homepageRoutes = require("./routes/homepageRoutes.js");
const projectRoutes = require("./routes/projectRoutes.js");

// DEBUG
console.log("homepageRoutes type:", typeof homepageRoutes);

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
  res.json({ message: "Server berjalan", status: "ok" });
});

/* ======================
   404
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
    return res.status(400).json({ message: "File terlalu besar (maks 2MB)" });
  }

  return res.status(500).json({
    message: err.message || "Server error",
  });
});

/* ======================
   START SERVER
====================== */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});