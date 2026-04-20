import { useEffect, useState } from "react";
import {
  getNews,
  createNews,
  updateNews,
  deleteNews,
  updateNewsStatus, // ✅ TAMBAH INI
} from "../../services/newsService";
import Swal from "sweetalert2";

export default function NewsManagement() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null,
    status: "published", // ✅ TAMBAH
  });

  const [fileKey, setFileKey] = useState(Date.now());

  // ======================
  // LOAD DATA
  // ======================
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getNews();
      setNews(res.data || []);
    } catch (err) {
      Swal.fire("Error", "Gagal mengambil data news", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ======================
  // HANDLE FORM
  // ======================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append("title", form.title);
      data.append("content", form.content);
      data.append("status", form.status); // ✅ TAMBAH

      if (form.image) {
        data.append("image", form.image);
      }

      if (editId) {
        await updateNews(editId, data);
        Swal.fire("Berhasil", "News berhasil diupdate", "success");
      } else {
        await createNews(data);
        Swal.fire("Berhasil", "News berhasil ditambahkan", "success");
      }

      resetForm();
      loadData();
    } catch (err) {
      Swal.fire("Error", "Gagal menyimpan news", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      await deleteNews(id);
      Swal.fire("Terhapus!", "", "success");
      loadData();
    }
  };

  // ======================
  // EDIT
  // ======================
  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      content: item.content,
      image: null,
      status: item.status || "published", // ✅ TAMBAH
    });
    setFileKey(Date.now());
  };

  // ======================
  // TOGGLE STATUS  
  // ======================
  const handleToggleStatus = async (item) => {
    const newStatus = item.status === "published" ? "draft" : "published";

    try {
      await updateNewsStatus(item.id, newStatus);

      Swal.fire(
        "Berhasil",
        `News diubah ke ${newStatus}`,
        "success"
      );

      loadData();
    } catch {
      Swal.fire("Error", "Gagal update status", "error");
    }
  };

  // ======================
  // RESET
  // ======================
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kelola News</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
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

        {/* ✅ DROPDOWN STATUS */}
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="published">Publish</option>
          <option value="draft">Draft</option>
        </select>

        <input
          key={fileKey}
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editId ? "Update News" : "Tambah News"}
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

      {/* LIST NEWS */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        news.map((n) => (
          <div key={n.id} className="bg-white p-4 rounded shadow mb-3">
            <h3 className="font-semibold">{n.title}</h3>
            <p className="text-sm text-gray-600">{n.content}</p>

            {/* ✅ STATUS BADGE */}
            <span
              className={`text-xs px-2 py-1 rounded ${
                n.status === "draft"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {n.status}
            </span>

            <div className="flex gap-3 mt-2">
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

              {/*   TOGGLE BUTTON */}
              <button
                onClick={() => handleToggleStatus(n)}
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