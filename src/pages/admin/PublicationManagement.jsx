import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
} from "../../services/publicationService";

export default function PublicationManagement() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("year_desc");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    authors: [{ name: "", bold: false }],
    year: new Date().getFullYear(),
    journal: "",
    url: "",
    doi: "",
    keywords: "",
  });

  // ================= AUTHOR =================
  const addAuthor = () => {
    setForm((p) => ({
      ...p,
      authors: [...p.authors, { name: "", bold: false }],
    }));
  };

  const removeAuthor = (i) => {
    const updated = [...form.authors];
    updated.splice(i, 1);
    setForm((p) => ({ ...p, authors: updated }));
  };

  const updateAuthor = (i, field, value) => {
    const updated = [...form.authors];
    updated[i][field] = value;
    setForm((p) => ({ ...p, authors: updated }));
  };

  // ================= LOAD =================
  const load = useCallback(async (nextPage = 1) => {
    try {
      setLoading(true);
      const res = await getPublications({ page: nextPage, limit, sort, search });

      setRows(res.data?.data || []);
      setMeta(res.data?.meta || { page: nextPage, limit, total: 0, totalPages: 1 });
      setPage(nextPage);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Gagal load", "error");
    } finally {
      setLoading(false);
    }
  }, [sort, search]);

  useEffect(() => {
    load(1);
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => load(1), 400);
    return () => clearTimeout(t);
  }, [search, load]);

  // ================= FORM =================
  const resetForm = () => {
    setEditId(null);
    setForm({
      title: "",
      authors: [{ name: "", bold: false }],
      year: new Date().getFullYear(),
      journal: "",
      url: "",
      doi: "",
      keywords: "",
    });
  };

  const onEdit = (item) => {
    setEditId(item.id);

    const parsedAuthors =
      item.authors?.split(",").map((a) => ({
        name: a.replace(/<\/?b>/g, "").trim(),
        bold: a.includes("<b>"),
      })) || [{ name: "", bold: false }];

    setForm({
      title: item.title || "",
      authors: parsedAuthors,
      year: item.year || new Date().getFullYear(),
      journal: item.journal || "",
      url: item.url || "",
      doi: item.doi || "",
      keywords: item.keywords || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);

      const payload = {
        title: form.title,
        authors: form.authors
          .map((a) => (a.bold ? `<b>${a.name}</b>` : a.name))
          .join(", "),
        year: form.year,
        journal: form.journal,
        url: form.url,
        doi: form.doi,
        keywords: form.keywords,
      };

      if (editId) {
        await updatePublication(editId, payload);
        Swal.fire("Success", "Berhasil update", "success");
      } else {
        await createPublication(payload);
        Swal.fire("Success", "Berhasil tambah", "success");
      }

      resetForm();
      load(1);
    } catch (err) {
      Swal.fire("Error", "Gagal simpan", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus data?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    await deletePublication(id);
    load(page);
  };

  const canPrev = page > 1;
  const canNext = page < meta.totalPages;

  // ================= UI =================
  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Publication Management</h1>
        <p className="text-slate-500">Kelola data publikasi</p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow border p-6 mb-6">
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">

          <input className="input" placeholder="Judul"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          {/* AUTHORS */}
          <div className="md:col-span-2">
            <label className="text-sm mb-2 block">Authors</label>

            {form.authors.map((a, i) => (
              <div key={i} className="flex gap-2 mb-2">

                <input
                  className="input flex-1"
                  placeholder={`Author ${i + 1}`}
                  value={a.name}
                  onChange={(e) => updateAuthor(i, "name", e.target.value)}
                  required
                />

                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={a.bold}
                    onChange={(e) => updateAuthor(i, "bold", e.target.checked)}
                  />
                  Bold
                </label>

                {form.authors.length > 1 && (
                  <button type="button" onClick={() => removeAuthor(i)}>✕</button>
                )}
              </div>
            ))}

            <button type="button" onClick={addAuthor} className="text-blue-600 text-sm">
              + Tambah Author
            </button>
          </div>

          <input type="number" className="input"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />

          <textarea
  className="input md:col-span-2 min-h-[100px] resize-none"
  placeholder="Journal (contoh: International Journal of Artificial Intelligence)"
  value={form.journal}
  onChange={(e) => setForm({ ...form, journal: e.target.value })}
/>

          <input className="input md:col-span-2" placeholder="URL"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            required
          />

          <input className="input md:col-span-2" placeholder="DOI"
            value={form.doi}
            onChange={(e) => setForm({ ...form, doi: e.target.value })}
          />

          <textarea className="input md:col-span-2" placeholder="Keywords"
            value={form.keywords}
            onChange={(e) => setForm({ ...form, keywords: e.target.value })}
          />

          <button className="md:col-span-2 bg-slate-900 text-white py-2 rounded-xl">
            {submitting ? "Loading..." : "Simpan"}
          </button>
        </form>
      </div>

      {/* FILTER */}
      <div className="flex gap-3 mb-4">
        <input
          className="input w-full"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="input w-48"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="year_desc">Terbaru</option>
          <option value="year_asc">Terlama</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="p-4 text-gray-500">Data kosong</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Judul</th>
                <th className="p-3">Authors</th>
                <th className="p-3">Keywords</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t hover:bg-slate-50">
                  <td className="p-3">{r.title}</td>
                  <td className="p-3" dangerouslySetInnerHTML={{ __html: r.authors }} />
                  <td className="p-3">{r.keywords}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => onEdit(r)} className="text-blue-600">Edit</button>
                    <button onClick={() => onDelete(r.id)} className="text-red-600">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <button disabled={!canPrev}
          onClick={() => load(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>Page {page} / {meta.totalPages}</span>

        <button disabled={!canNext}
          onClick={() => load(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </div>
  );
}