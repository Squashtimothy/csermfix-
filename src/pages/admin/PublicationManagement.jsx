import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";

import {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
  archivePublication,
  unarchivePublication,
} from "../../services/publicationService";

export default function PublicationManagement() {

  // ================= STATE =================
  const [rows, setRows] = useState([]);

  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState("year_desc");

  const [showArchived, setShowArchived] = useState(false);

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
    setForm((prev) => ({
      ...prev,
      authors: [...prev.authors, { name: "", bold: false }],
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

  const updateAuthor = (index, field, value) => {
    const updated = [...form.authors];

    updated[index][field] = value;

    setForm((prev) => ({
      ...prev,
      authors: updated,
    }));
  };

  // ================= LOAD =================
  const load = useCallback(
    async (nextPage = 1) => {
      try {
        setLoading(true);

        const res = await getPublications({
          page: nextPage,
          limit,
          search,
          sort,
          archived: showArchived,
        });

        console.log("PUBLICATION RESPONSE :", res.data);

        let publicationData = [];

        let paginationMeta = {
          page: nextPage,
          limit,
          total: 0,
          totalPages: 1,
        };

        // FORMAT ARRAY
        if (Array.isArray(res.data)) {
          publicationData = res.data;
        }

        // FORMAT DATA
        else if (Array.isArray(res.data?.data)) {
          publicationData = res.data.data;

          paginationMeta =
            res.data.meta || paginationMeta;
        }

        // FORMAT PUBLICATIONS
        else if (Array.isArray(res.data?.publications)) {
          publicationData = res.data.publications;
        }

        setRows(publicationData);

        setMeta(paginationMeta);

        setPage(nextPage);

      } catch (err) {

        console.error(err);

        Swal.fire(
          "Error",
          err.response?.data?.message ||
            "Gagal mengambil publication",
          "error"
        );

      } finally {
        setLoading(false);
      }
    },
    [search, sort, showArchived]
  );

  // ================= INITIAL LOAD =================
  useEffect(() => {
    load(1);
  }, [load]);

  // ================= SEARCH DELAY =================
  useEffect(() => {

    const timer = setTimeout(() => {
      load(1);
    }, 500);

    return () => clearTimeout(timer);

  }, [search, load]);

  // ================= RESET =================
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

  // ================= EDIT =================
  const onEdit = (item) => {

    setEditId(item.id);

    const parsedAuthors =
      item.authors?.split(",").map((author) => ({
        name: author.replace(/<\/?b>/g, "").trim(),
        bold: author.includes("<b>"),
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= SUBMIT =================
  const onSubmit = async (e) => {

    e.preventDefault();

    if (submitting) return;

    try {

      setSubmitting(true);

      const payload = {
        title: form.title,

        authors: form.authors
          .map((author) =>
            author.bold
              ? `<b>${author.name}</b>`
              : author.name
          )
          .join(", "),

        year: form.year,

        journal: form.journal,

        url: form.url,

        doi: form.doi,

        keywords: form.keywords,
      };

      console.log("PAYLOAD :", payload);

      if (editId) {

        await updatePublication(editId, payload);

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

      await load(1);

    } catch (err) {

      console.error(err);

      Swal.fire(
        "Error",
        err.response?.data?.message ||
          "Gagal menyimpan publication",
        "error"
      );

    } finally {

      setSubmitting(false);
    }
  };

  // ================= DELETE =================
  const onDelete = async (id) => {

    const confirm = await Swal.fire({
      title: "Hapus publication?",
      text: "Data tidak bisa dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
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

      load(page);

    } catch (err) {

      Swal.fire(
        "Error",
        "Gagal menghapus publication",
        "error"
      );
    }
  };

  // ================= ARCHIVE =================
  const onArchive = async (id, archived = false) => {

    try {

      if (archived) {

        await unarchivePublication(id);

        Swal.fire(
          "Success",
          "Publication berhasil direstore",
          "success"
        );

      } else {

        await archivePublication(id);

        Swal.fire(
          "Success",
          "Publication berhasil diarchive",
          "success"
        );
      }

      load(page);

    } catch (err) {

      Swal.fire(
        "Error",
        "Gagal archive publication",
        "error"
      );
    }
  };

  // ================= PAGINATION =================
  const canPrev = page > 1;

  const canNext = page < meta.totalPages;

  // ================= UI =================
  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold text-slate-800">
          Publication Management
        </h1>

        <p className="text-slate-500">
          Kelola data publication
        </p>

      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow border p-6 mb-6">

        <form
          onSubmit={onSubmit}
          className="grid md:grid-cols-2 gap-4"
        >

          {/* TITLE */}
          <input
            className="input"
            placeholder="Judul Publication"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            required
          />

          {/* YEAR */}
          <input
            type="number"
            className="input"
            value={form.year}
            onChange={(e) =>
              setForm({
                ...form,
                year: e.target.value,
              })
            }
            required
          />

          {/* AUTHORS */}
          <div className="md:col-span-2">

            <label className="text-sm mb-2 block">
              Authors
            </label>

            {form.authors.map((author, index) => (
              <div
                key={index}
                className="flex gap-2 mb-2"
              >

                <input
                  className="input flex-1"
                  placeholder={`Author ${index + 1}`}
                  value={author.name}
                  onChange={(e) =>
                    updateAuthor(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  required
                />

                <label className="flex items-center gap-1 text-sm">

                  <input
                    type="checkbox"
                    checked={author.bold}
                    onChange={(e) =>
                      updateAuthor(
                        index,
                        "bold",
                        e.target.checked
                      )
                    }
                  />

                  Bold

                </label>

                {form.authors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAuthor(index)}
                    className="text-red-500 px-2"
                  >
                    ✕
                  </button>
                )}

              </div>
            ))}

            <button
              type="button"
              onClick={addAuthor}
              className="text-blue-600 text-sm"
            >
              + Tambah Author
            </button>

          </div>

          {/* JOURNAL */}
          <textarea
            className="input md:col-span-2 min-h-[100px] resize-none"
            placeholder="Journal"
            value={form.journal}
            onChange={(e) =>
              setForm({
                ...form,
                journal: e.target.value,
              })
            }
            required
          />

          {/* URL */}
          <input
            className="input md:col-span-2"
            placeholder="URL"
            value={form.url}
            onChange={(e) =>
              setForm({
                ...form,
                url: e.target.value,
              })
            }
          />

          {/* DOI */}
          <input
            className="input md:col-span-2"
            placeholder="DOI"
            value={form.doi}
            onChange={(e) =>
              setForm({
                ...form,
                doi: e.target.value,
              })
            }
          />

          {/* KEYWORDS */}
          <textarea
            className="input md:col-span-2"
            placeholder="Keywords"
            value={form.keywords}
            onChange={(e) =>
              setForm({
                ...form,
                keywords: e.target.value,
              })
            }
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 bg-slate-900 text-white py-3 rounded-xl"
          >
            {submitting
              ? "Loading..."
              : editId
              ? "Update Publication"
              : "Simpan"}
          </button>

        </form>
      </div>

      {/* FILTER */}
      <div className="flex gap-3 mb-4">

        {/* SEARCH */}
        <input
          className="input w-full"
          placeholder="Search..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* SORT */}
        <select
          className="input w-48"
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
        >
          <option value="year_desc">
            Terbaru
          </option>

          <option value="year_asc">
            Terlama
          </option>
        </select>

        {/* ARCHIVE FILTER */}
        <button
          onClick={() =>
            setShowArchived(!showArchived)
          }
          className={`px-4 rounded-xl text-sm ${
            showArchived
              ? "bg-red-100 text-red-700"
              : "bg-slate-900 text-white"
          }`}
        >
          {showArchived
            ? "Lihat Active"
            : "Lihat Archive"}
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        {loading ? (

          <p className="p-4 text-gray-500">
            Loading...
          </p>

        ) : rows.length === 0 ? (

          <p className="p-4 text-gray-500">
            Data kosong
          </p>

        ) : (

          <table className="w-full text-sm">

            <thead className="bg-slate-100 text-left">

              <tr>

                <th className="p-3">
                  Judul
                </th>

                <th className="p-3">
                  Authors
                </th>

                <th className="p-3">
                  Keywords
                </th>

                <th className="p-3">
                  Aksi
                </th>

              </tr>

            </thead>

            <tbody>

              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t hover:bg-slate-50"
                >

                  {/* TITLE */}
                  <td className="p-3">
                    {row.title}
                  </td>

                  {/* AUTHORS */}
                  <td
                    className="p-3"
                    dangerouslySetInnerHTML={{
                      __html: row.authors,
                    }}
                  />

                  {/* KEYWORDS */}
                  <td className="p-3">
                    {row.keywords}
                  </td>

                  {/* ACTION */}
                  <td className="p-3 flex gap-3 items-center">

                    {/* EDIT */}
                    <button
                      onClick={() => onEdit(row)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    {/* ARCHIVE */}
                    <button
                      onClick={() =>
                        onArchive(
                          row.id,
                          row.archived
                        )
                      }
                      className="text-yellow-600 hover:underline"
                    >
                      {row.archived
                        ? "Restore"
                        : "Archive"}
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        onDelete(row.id)
                      }
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">

        <button
          disabled={!canPrev}
          onClick={() => load(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} / {meta.totalPages}
        </span>

        <button
          disabled={!canNext}
          onClick={() => load(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  );
}