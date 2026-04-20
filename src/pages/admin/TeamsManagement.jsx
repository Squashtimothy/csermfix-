// src/pages/admin/TeamsManagement.jsx
import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../../services/teamService";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function TeamsManagement() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    position: "",
    bio: "",
    category: "staff",
    photo: null,
  });

  const [fileKey, setFileKey] = useState(Date.now());

  // ================= NORMALIZE CATEGORY =================
  const normalizeCategory = (c) => {
    const val = (c || "staff").toString().trim().toLowerCase();
    if (val === "management") return "management";
    if (val === "expert") return "expert";
    return "staff";
  };

  // ================= LOAD DATA (FIX WARNING) =================
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTeams();

      const cleaned = (res.data || []).map((t) => ({
        ...t,
        category: normalizeCategory(t.category),
      }));

      setTeams(cleaned);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Gagal ambil data team",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      position: "",
      bio: "",
      category: "staff",
      photo: null,
    });
    setEditId(null);
    setFileKey(Date.now());
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name || "",
      position: item.position || "",
      bio: item.bio || "",
      category: normalizeCategory(item.category),
      photo: null,
    });
    setFileKey(Date.now());
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append("name", form.name);
      data.append("position", form.position);
      data.append("bio", form.bio);
      data.append("category", normalizeCategory(form.category));

      if (form.photo) data.append("photo", form.photo);

      if (editId) {
        await updateTeam(editId, data);
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Team berhasil diupdate",
          timer: 1400,
          showConfirmButton: false,
        });
      } else {
        await createTeam(data);
        Swal.fire({
          icon: "success",
          title: "Created",
          text: "Team berhasil ditambahkan",
          timer: 1400,
          showConfirmButton: false,
        });
      }

      resetForm();
      loadData();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Gagal menyimpan team",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus team?",
      text: "Data akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteTeam(id);
      Swal.fire("Terhapus", "Team berhasil dihapus", "success");
      loadData();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Gagal hapus team",
        "error"
      );
    }
  };

  // ================= BADGE =================
  const badgeClass = (category) => {
    const c = normalizeCategory(category);
    if (c === "management") return "bg-green-100 text-green-700";
    if (c === "expert") return "bg-purple-100 text-purple-700";
    return "bg-blue-100 text-blue-700";
  };

  const badgeText = (category) => {
    const c = normalizeCategory(category);
    if (c === "management") return "Management";
    if (c === "expert") return "Expert Associate";
    return "Staff";
  };

  // ================= RENDER =================
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kelola Teams</h1>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama"
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="management">CSERM MANAGEMENT</option>
          <option value="expert">CSERM Expert Associate</option>
          <option value="staff">CSERM STAFF</option>
        </select>

        <input
          name="position"
          value={form.position}
          onChange={handleChange}
          placeholder="Posisi/Jabatan"
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Bio (opsional)"
          className="w-full border p-2 rounded"
          rows={4}
        />

        <input
          key={fileKey}
          type="file"
          name="photo"
          onChange={handleChange}
          accept="image/*"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {submitting
              ? "Menyimpan..."
              : editId
              ? "Update Team"
              : "Tambah Team"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : teams.length === 0 ? (
        <p className="text-gray-500">Belum ada data team</p>
      ) : (
        teams.map((t) => (
          <div
            key={t.id}
            className="bg-white p-4 rounded shadow mb-3 flex items-start gap-4"
          >
            <img
              src={
                t.photo
                  ? `${API_BASE_URL}/uploads/teams/${t.photo}`
                  : "https://via.placeholder.com/80?text=No+Photo"
              }
              alt={t.name}
              className="w-20 h-20 object-cover rounded-xl border"
            />

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{t.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${badgeClass(
                    t.category
                  )}`}
                >
                  {badgeText(t.category)}
                </span>
              </div>

              <p className="text-sm text-gray-600">{t.position}</p>
              {t.bio && (
                <p className="text-sm text-gray-500 mt-1">{t.bio}</p>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => handleEdit(t)}
                  className="text-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-600 text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}