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

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",

    authors: [
      {
        name: "",
        bold: false,
      },
    ],

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

      const res = await getPublications();

      setRows(
        Array.isArray(res?.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(err);

      Swal.fire(
        "Error",
        err?.response?.data?.message ||
          "Gagal mengambil publication",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

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

      authors: [
        ...prev.authors,

        {
          name: "",
          bold: false,
        },
      ],
    }));
  };

  const removeAuthor = (index) => {
    const updated = [...form.authors];

    updated.splice(index, 1);

    setForm((prev) => ({
      ...prev,

      authors:
        updated.length > 0
          ? updated
          : [
              {
                name: "",
                bold: false,
              },
            ],
    }));
  };

  const changeAuthor = (
    index,
    field,
    value
  ) => {
    const updated = [...form.authors];

    updated[index][field] = value;

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

      authors: [
        {
          name: "",
          bold: false,
        },
      ],

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

      const cleanAuthors =
        form.authors.filter(
          (a) => a.name.trim() !== ""
        );

      const payload = {
        title: form.title.trim(),

        authors: cleanAuthors
          .map((author) => {
            if (author.bold) {
              return `<strong>${author.name}</strong>`;
            }

            return author.name;
          })
          .join(", "),

        year: Number(form.year),

        journal: form.journal.trim(),

        url: form.url.trim(),

        doi: form.doi.trim(),

        keywords: form.keywords.trim(),
      };

      if (
        !payload.title ||
        !payload.authors ||
        !payload.year
      ) {
        setSaving(false);

        return Swal.fire(
          "Error",
          "Title, authors, dan year wajib diisi",
          "error"
        );
      }

      if (editingId) {
        await updatePublication(
          editingId,
          payload
        );

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
        ? item.authors
            .split(",")
            .map((a) => {
              const trimmed =
                a.trim();

              const isBold =
                trimmed.includes(
                  "<strong>"
                );

              return {
                name: trimmed
                  .replace(
                    /<strong>/g,
                    ""
                  )
                  .replace(
                    /<\/strong>/g,
                    ""
                  )
                  .trim(),

                bold: isBold,
              };
            })
        : [
            {
              name: "",
              bold: false,
            },
          ],

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

      {/* =========================
          FORM
      ========================= */}

      <form
        onSubmit={onSubmit}
        className="bg-white shadow rounded-2xl p-6 mb-6"
      >
        <div className="space-y-4">

          {/* TITLE */}

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={onChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          {/* AUTHORS */}

          <div>
            <label className="font-medium">
              Authors
            </label>

            <div className="space-y-3 mt-2">

              {form.authors.map(
                (author, index) => (
                  <div
                    key={index}
                    className="border rounded-xl p-3"
                  >
                    <div className="flex gap-2 items-center">

                      <input
                        type="text"
                        value={author.name}
                        onChange={(e) =>
                          changeAuthor(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder={`Author ${
                          index + 1
                        }`}
                        className="flex-1 border rounded-xl px-4 py-3"
                      />

                      {/* CHECKBOX BOLD */}

                      <label className="flex items-center gap-2 text-sm whitespace-nowrap">

                        <input
                          type="checkbox"
                          checked={
                            author.bold
                          }
                          onChange={(e) =>
                            changeAuthor(
                              index,
                              "bold",
                              e.target.checked
                            )
                          }
                        />

                        Bold

                      </label>

                      {/* DELETE */}

                      {form.authors.length >
                        1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeAuthor(
                              index
                            )
                          }
                          className="px-3 py-2 bg-red-500 text-white rounded-xl"
                        >
                          X
                        </button>
                      )}

                    </div>
                  </div>
                )
              )}

            </div>

            <button
              type="button"
              onClick={addAuthor}
              className="mt-2 text-blue-600"
            >
              + Tambah Author
            </button>
          </div>

          {/* YEAR */}

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={form.year}
            onChange={onChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          {/* JOURNAL */}

          <input
            type="text"
            name="journal"
            placeholder="Journal"
            value={form.journal}
            onChange={onChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          {/* URL */}

          <input
            type="text"
            name="url"
            placeholder="URL"
            value={form.url}
            onChange={onChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          {/* DOI */}

          <input
            type="text"
            name="doi"
            placeholder="DOI"
            value={form.doi}
            onChange={onChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          {/* KEYWORDS */}

          <textarea
            name="keywords"
            placeholder="Keywords"
            value={form.keywords}
            onChange={onChange}
            rows={4}
            className="w-full border rounded-xl px-4 py-3"
          />

          {/* BUTTON */}

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

      {/* =========================
          TABLE
      ========================= */}

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

              <p
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: String(
                    item.authors || ""
                  ),
                }}
              />

              <p className="text-sm mt-1">
                {item.year}
              </p>

              <div className="flex gap-3 mt-4">

                <button
                  onClick={() =>
                    onEdit(item)
                  }
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    onDelete(item.id)
                  }
                  className="text-red-600"
                >
                  Hapus
                </button>

              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}