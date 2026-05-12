import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE_URL =
  "https://resilient-balance-production-57f8.up.railway.app";

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

  /* =========================
      CATEGORY
  ========================= */

  const normalizeCategory = (value) => {
    const category = (value || "staff")
      .toString()
      .trim()
      .toLowerCase();

    if (category === "management") {
      return "management";
    }

    if (category === "expert") {
      return "expert";
    }

    return "staff";
  };

  /* =========================
      AUTH
  ========================= */

  const getToken = () => {
    return localStorage.getItem("token");
  };

  /* =========================
      IMAGE URL
  ========================= */

  const getImageUrl = (photo) => {
    if (!photo) {
      return "https://via.placeholder.com/100x100?text=No+Image";
    }

    if (photo.startsWith("http")) {
      return photo;
    }

    return `${API_BASE_URL}/uploads/${photo}`;
  };

  /* =========================
      LOAD DATA
  ========================= */

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/api/teams`
      );

      console.log("TEAM RESPONSE:", response.data);

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      const cleanedData = data.map((item) => ({
        ...item,
        category: normalizeCategory(item.category),
      }));

      setTeams(cleanedData);
    } catch (error) {
      console.error("LOAD TEAM ERROR:", error);

      Swal.fire(
        "Error",
        error?.response?.data?.message ||
          "Gagal mengambil data teams",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* =========================
      INPUT
  ========================= */

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  /* =========================
      RESET
  ========================= */

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

  /* =========================
      EDIT
  ========================= */

  const handleEdit = (team) => {
    setEditId(team.id);

    setForm({
      name: team.name || "",
      position: team.position || "",
      bio: team.bio || "",
      category: normalizeCategory(team.category),
      photo: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
      SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      return Swal.fire(
        "Unauthorized",
        "Silakan login ulang",
        "warning"
      );
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("position", form.position);
      formData.append("bio", form.bio || "");

      formData.append(
        "category",
        normalizeCategory(form.category)
      );

      if (form.photo) {
        formData.append("photo", form.photo);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editId) {
        await axios.put(
          `${API_BASE_URL}/api/teams/${editId}`,
          formData,
          config
        );

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Team berhasil diupdate",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await axios.post(
          `${API_BASE_URL}/api/teams`,
          formData,
          config
        );

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Team berhasil ditambahkan",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      resetForm();

      await loadData();
    } catch (error) {
      console.error("SAVE TEAM ERROR:", error);

      Swal.fire(
        "Error",
        error?.response?.data?.message ||
          "Gagal menyimpan team",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
      DELETE
  ========================= */

  const handleDelete = async (id) => {
    const token = getToken();

    const result = await Swal.fire({
      title: "Hapus Team?",
      text: "Data akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/api/teams/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire(
        "Berhasil",
        "Team berhasil dihapus",
        "success"
      );

      await loadData();
    } catch (error) {
      console.error("DELETE TEAM ERROR:", error);

      Swal.fire(
        "Error",
        error?.response?.data?.message ||
          "Gagal menghapus team",
        "error"
      );
    }
  };

  /* =========================
      BADGE
  ========================= */

  const badgeClass = (category) => {
    const c = normalizeCategory(category);

    if (c === "management") {
      return "bg-green-100 text-green-700";
    }

    if (c === "expert") {
      return "bg-purple-100 text-purple-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  const badgeText = (category) => {
    const c = normalizeCategory(category);

    if (c === "management") {
      return "Management";
    }

    if (c === "expert") {
      return "Expert Associate";
    }

    return "Staff";
  };

  /* =========================
      UI
  ========================= */

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">
        Kelola Teams
      </h1>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-2xl p-5 space-y-4 mb-8"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama"
          className="w-full border rounded-lg p-3"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >
          <option value="management">
            CSERM MANAGEMENT
          </option>

          <option value="expert">
            CSERM EXPERT ASSOCIATE
          </option>

          <option value="staff">
            CSERM STAFF
          </option>
        </select>

        <input
          type="text"
          name="position"
          value={form.position}
          onChange={handleChange}
          placeholder="Posisi / Jabatan"
          className="w-full border rounded-lg p-3"
          required
        />

        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Bio"
          rows={4}
          className="w-full border rounded-lg p-3"
        />

        <input
          key={fileKey}
          type="file"
          name="photo"
          onChange={handleChange}
          accept="image/*"
          className="w-full"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
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
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-3 rounded-lg"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* LIST */}

      {loading ? (
        <div className="text-center py-10">
          Loading...
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Belum ada data team
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-2xl shadow p-4 flex flex-col md:flex-row gap-4"
            >
              <img
                src={getImageUrl(team.photo)}
                alt={team.name}
                className="w-24 h-24 object-cover rounded-xl border"
              />

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="font-bold text-lg">
                    {team.name}
                  </h2>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${badgeClass(
                      team.category
                    )}`}
                  >
                    {badgeText(team.category)}
                  </span>
                </div>

                <p className="text-gray-600 text-sm">
                  {team.position}
                </p>

                {team.bio && (
                  <p className="text-gray-500 text-sm mt-2 whitespace-pre-line">
                    {team.bio}
                  </p>
                )}

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleEdit(team)}
                    className="text-blue-600 font-medium"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(team.id)
                    }
                    className="text-red-600 font-medium"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}