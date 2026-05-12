const db = require("../config/db");

const normalizeCategory = (category) => {
  const c = (category || "staff").toString().trim().toLowerCase();
  return c;
};

const isValidCategory = (category) =>
  ["management", "staff", "expert"].includes(category);
// GET all teams
exports.getAll = async (req, res) => {
  try {
    // Ambil kolom category juga
    const [rows] = await db.query(
      "SELECT id, name, position, bio, photo, category, created_at FROM teams ORDER BY created_at DESC"
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET TEAMS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// CREATE team
exports.create = async (req, res) => {
  try {
    const { name, position, bio, category } = req.body || {};

    if (!name || !position) {
      return res.status(400).json({ message: "Name & position wajib diisi" });
    }

    const cat = normalizeCategory(category);
    if (!isValidCategory(cat)) {
      return res.status(400).json({ message: "Category tidak valid. Pilih management atau staff" });
    }

    const photo = req.file ? req.file.filename : null;

    await db.query(
      "INSERT INTO teams (name, position, bio, photo, category) VALUES (?, ?, ?, ?, ?)",
      [name.trim(), position.trim(), bio || null, photo, cat]
    );

    return res.status(201).json({ message: "Team berhasil ditambahkan" });
  } catch (err) {
    console.error("CREATE TEAM ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE team
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, bio, category } = req.body || {};

    if (!name || !position) {
      return res.status(400).json({ message: "Name & position wajib diisi" });
    }

    const cat = normalizeCategory(category);
    if (!isValidCategory(cat)) {
      return res.status(400).json({ message: "Category tidak valid. Pilih management atau staff" });
    }

    let query = "UPDATE teams SET name=?, position=?, bio=?, category=?";
    const values = [name.trim(), position.trim(), bio || null, cat];

    if (req.file) {
      query += ", photo=?";
      values.push(req.file.filename);
    }

    query += " WHERE id=?";
    values.push(id);

    await db.query(query, values);

    return res.json({ message: "Team berhasil diupdate" });
  } catch (err) {
    console.error("UPDATE TEAM ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE team
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM teams WHERE id=?", [id]);
    return res.json({ message: "Team berhasil dihapus" });
  } catch (err) {
    console.error("DELETE TEAM ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
