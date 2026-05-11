import { useEffect, useState } from "react";
import {
  getNews,
  createNews,
  updateNews,
  deleteNews,
  updateNewsStatus,
} from "../../services/newsService";

import Swal from "sweetalert2";

const API_BASE = (
  process.env.REACT_APP_API_URL ||
  "https://resilient-balance-production-57f8.up.railway.app"
).replace(/\/$/, "");

/* ======================
   RESOLVE IMAGE
====================== */

const resolveImage = (image) => {
  if (!image) {
    return "https://via.placeholder.com/400x200?text=No+Image";
  }

  // jika sudah full url
  if (image.startsWith("http")) {
    return image;
  }

  // hapus slash depan
  const cleanImage = image.replace(/^\/+/, "");

  return `${API_BASE}/uploads/${cleanImage}`;
};

export default function NewsManagement() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null,
    status: "published",
  });

  const [fileKey, setFileKey] = useState(Date.now());

  /* ======================
     LOAD DATA
  ====================== */

  const loadData = async () => {
    try {
      setLoading(true);

      const data = await getNews();

      console.log("NEWS:", data);

      if (Array.isArray(data)) {
        setNews(data);
      } else {
        setNews([]);
      }
    } catch (err) {
      console.error("LOAD NEWS ERROR:", err);

      setNews([]);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengambil data news",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ======================
     HANDLE INPUT
  ====================== */

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  /* ======================
     RESET FORM
  ====================== */

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      image: null,
      status: "published",
    });

    setEditId(null);

    setFileKey(Date.now());
  };

  /* ======================
     SUBMIT
  ====================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("status", form.status);

      if (form.image) {
        formData.append("image", form.image);
      }

      if (editId) {
        await updateNews(editId, formData);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "News berhasil diupdate",
        });
      } else {
        await createNews(formData);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "News berhasil ditambahkan",
        });
      }

      resetForm();

      await loadData();
    } catch (err) {
      console.error("SUBMIT ERROR:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err?.response?.data?.message ||
          "Gagal menyimpan news",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ======================
     DELETE
  ====================== */

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Yakin ingin menghapus?",
        icon: "warning",
        showCancelButton: true,
      });

      if (!result.isConfirmed) return;

      await deleteNews(id);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "News berhasil dihapus",
      });

      await loadData();
    } catch (err) {
      console.error("DELETE ERROR:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal menghapus news",
      });
    }
  };

  /* ======================
     EDIT
  ====================== */

  const handleEdit = (item) => {
    setEditId(item.id);

    setForm({
      title: item.title || "",
      content: item.content || "",
      image: null,
      status: item.status || "published",
    });

    setFileKey(Date.now());

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ======================
     TOGGLE STATUS
  ====================== */

  const handleToggleStatus = async (item) => {
    try {
      const newStatus =
        item.status === "published"
          ? "draft"
          : "published";

      await updateNewsStatus(
        item.id,
        newStatus
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: `Status diubah ke ${newStatus}`,
      });

      await loadData();
    } catch (err) {
      console.error("STATUS ERROR:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err?.response?.data?.message ||
          "Gagal update status",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Kelola News
      </h1>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-3 mb-6"
      >
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Judul"
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Konten"
          className="w-full border p-2 rounded"
          rows={4}
          required
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="published">
            Publish
          </option>

          <option value="draft">
            Draft
          </option>
        </select>

        <input
          key={fileKey}
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {submitting
              ? "Loading..."
              : editId
              ? "Update News"
              : "Tambah News"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* LIST */}

      {loading ? (
        <p>Loading...</p>
      ) : news.length === 0 ? (
        <p>Tidak ada data news</p>
      ) : (
        news.map((n) => (
          <div
            key={n.id}
            className="bg-white p-4 rounded shadow mb-3"
          >
            <h3 className="font-semibold text-lg">
              {n.title}
            </h3>

            <p className="text-sm text-gray-600 mb-2">
              {n.content}
            </p>

            {/* IMAGE FIX */}

            <img
              src={resolveImage(n.image)}
              alt={n.title}
              className="w-40 h-28 object-cover rounded mb-2 border"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x200?text=No+Image";
              }}
            />

            {/* STATUS */}

            <span
              className={`text-xs px-2 py-1 rounded ${
                n.status === "draft"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {n.status}
            </span>

            {/* ACTION */}

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleEdit(n)}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(n.id)}
                className="text-red-600 text-sm"
              >
                Hapus
              </button>

              <button
                onClick={() =>
                  handleToggleStatus(n)
                }
                className="text-yellow-600 text-sm"
              >
                {n.status === "published"
                  ? "Jadikan Draft"
                  : "Publish"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}