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

// LOAD ENV
dotenv.config();

const app = express();

/* ======================
   DEBUG ENV
====================== */

console.log("PORT:", process.env.PORT);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);

/* ======================
   DB CONNECTION
====================== */

const db = require("./config/db");

(async () => {
  try {
    const [rows] = await db.query("SHOW TABLES");

    console.log("MySQL Connected...");
    console.log("DB CONNECTED SUCCESSFULLY");
    console.log("Tables:", rows);
  } catch (err) {
    console.error("DB CONNECTION FAILED:", err.message);
  }
})();

/* ======================
   CORS CONFIG
====================== */

const allowedOrigins = [
  "http://localhost:3000",
  "https://cserm.unas.ac.id",
  "https://www.cserm.unas.ac.id",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);

        callback(null, false);
      }
    },

    credentials: true,
  })
);

/* ======================
   BODY PARSER
====================== */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* ======================
   STATIC FILES
====================== */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ======================
   ROUTES
====================== */

const authRoutes = require("./routes/authRoutes");
const newsRoutes = require("./routes/newsRoutes");
const teamRoutes = require("./routes/teamRoutes");
const publicationRoutes = require("./routes/publicationRoutes");
const homepageRoutes = require("./routes/homepageRoutes");
const projectRoutes = require("./routes/projectRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/homepage", homepageRoutes);
app.use("/api/projects", projectRoutes);

/* ======================
   ROOT
====================== */

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend running",
  });
});

/* ======================
   404
====================== */

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* ======================
   ERROR HANDLER
====================== */

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

/* ======================
   START SERVER
====================== */

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});