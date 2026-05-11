import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";

import {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
} from "../../services/publicationService";

export default function PublicationManagement() {
  /* =========================
     STATES
  ========================= */

  const [rows, setRows] = useState([]);

  const [meta, setMeta] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("year_desc");
  const [page, setPage] = useState(1);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    authors: [""],
    year: new Date().getFullYear(),
    journal: "",
    url: "",
    doi: "",
    keywords: "",
  });

  /* =========================
     LOAD PUBLICATIONS
  ========================= */

  const fetchPublications = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getPublications({
        page,
        limit: 10,
        sort,
        search,
      });

      console.log("PUBLICATION RESPONSE:", res);

      setRows(Array.isArray(res.data) ? res.data : []);

      setMeta(
        res.meta || {
          page: 1,
          totalPages: 1,
          total: 0,
        }
      );
    } catch (err) {
      console.error(err);

      Swal.fire(
        "Error",
        err?.response?.data?.message ||
          "Gagal mengambil data publication",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [page, sort, search]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  /* =========================
     FORM HANDLER
  ========================= */

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     AUTHOR HANDLER
  ========================= */

  const addAuthor = () => {
    setForm((prev) => ({
      ...prev,
      authors: [...prev.authors, ""],
    }));
  };

  const removeAuthor = (index) => {
    const updated = [...form.authors];
    updated.splice(index, 1);

    setForm((prev) => ({
      ...prev,
      authors: updated,
    }));
  };

  const changeAuthor = (index, value) => {
    const updated = [...form.authors];
    updated[index] = value;

    setForm((prev) => ({
      ...prev,
      authors: updated,
    }));
  };

  /* =========================
     RESET FORM
  ========================= */

  const resetForm = () => {
    setEditingId(null);

    setForm({
      title: "",
      authors: [""],
      year: new Date().getFullYear(),
      journal: "",
      url: "",
      doi: "",
      keywords: "",
    });
  };

  /* =========================
     SAVE
  ========================= */

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        authors: form.authors.filter(Boolean).join(", "),
        year: form.year,
        journal: form.journal.trim(),
        url: form.url.trim(),
        doi: form.doi.trim(),
        keywords: form.keywords.trim(),
      };

      if (
        !payload.title ||
        !payload.authors ||
        !payload.year ||
        !payload.url
      ) {
        return Swal.fire(
          "Error",
          "Title, authors, year, dan url wajib diisi",
          "error"
        );
      }

      if (editingId) {
        await updatePublication(editingId, payload);

        Swal.fire(
          "Success",
          "Publication berhasil diupdate",
          "success"
        );
      } else {
        await createPublication(payload);

        Swal.fire(
          "Success",
          "Publication berhasil ditambahkan",
          "success"
        );
      }

      resetForm();

      await fetchPublications();
    } catch (err) {
      console.error(err);

      Swal.fire(
        "Error",
        err?.response?.data?.message ||
          "Gagal menyimpan publication",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     EDIT
  ========================= */

  const onEdit = (item) => {
    setEditingId(item.id);

    setForm({
      title: item.title || "",
      authors: item.authors
        ? item.authors.split(",").map((a) => a.trim())
        : [""],
      year: item.year || "",
      journal: item.journal || "",
      url: item.url || "",
      doi: item.doi || "",
      keywords: item.keywords || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     DELETE
  ========================= */

  const onDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus publication?",
      text: "Data tidak bisa dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deletePublication(id);

      Swal.fire(
        "Success",
        "Publication berhasil dihapus",
        "success"
      );

      await fetchPublications();
    } catch (err) {
      console.error(err);

      Swal.fire(
        "Error",
        err?.response?.data?.message ||
          "Gagal menghapus publication",
        "error"
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Kelola Publication
      </h1>

      {/* FORM */}
      <form
        onSubmit={onSubmit}
        className="bg-white shadow rounded-2xl p-6 mb-6"
      >
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={onChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <div>
            <label className="font-medium">Authors</label>

            <div className="space-y-2 mt-2">
              {form.authors.map((author, index) => (
                <div
                  key={index}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={author}
                    onChange={(e) =>
                      changeAuthor(index, e.target.value)
                    }
                    placeholder={`Author ${index + 1}`}
                    className="flex-1 border rounded-xl px-4 py-3"
                  />

                  {form.authors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAuthor(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-xl"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addAuthor}
              className="mt-2 text-blue-600"
            >
              + Tambah Author
            </button>
          </div>

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={form.year}
            onChange={onChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="journal"
            placeholder="Journal"
            value={form.journal}
            onChange={onChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="url"
            placeholder="URL"
            value={form.url}
            onChange={onChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="doi"
            placeholder="DOI"
            value={form.doi}
            onChange={onChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <textarea
            name="keywords"
            placeholder="Keywords"
            value={form.keywords}
            onChange={onChange}
            rows={4}
            className="w-full border rounded-xl px-4 py-3"
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#08112b] text-white py-3 rounded-xl"
          >
            {saving
              ? "Menyimpan..."
              : editingId
              ? "Update"
              : "Simpan"}
          </button>
        </div>
      </form>

      {/* FILTER */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-2"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
          <option value="year_desc">Terbaru</option>
          <option value="year_asc">Terlama</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            Loading...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-center">
            Data kosong
          </div>
        ) : (
          rows.map((item) => (
            <div
              key={item.id}
              className="border-b p-5"
            >
              <h2 className="font-bold text-lg">
                {item.title}
              </h2>

              <p className="text-sm text-gray-600">
                {item.authors}
              </p>

              <p className="text-sm mt-1">
                {item.year}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded-xl disabled:opacity-40"
        >
          Prev
        </button>

        <span>
          Page {meta.page} / {meta.totalPages}
        </span>

        <button
          disabled={page >= meta.totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded-xl disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}