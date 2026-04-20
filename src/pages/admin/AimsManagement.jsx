import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  getAimsAdmin,
  createAim,
  updateAim,
  deleteAim,
  resolveImage,
} from "../../services/homepageService";

export default function AimsManagement() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editId, setEditId] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  const [form, setForm] = useState({
    file: null,
    content: "",
    order_number: 1,
    is_active: 1,
  });

  const resetForm = () => {
    setEditId(null);
    setCurrentImage("");
    setForm({
      file: null,
      content: "",
      order_number: 1,
      is_active: 1,
    });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAimsAdmin();
      setRows(res.data || []);
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.message || "Gagal memuat aims", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "order_number" || name === "is_active"
          ? Number(value)
          : value,
    }));
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({
      ...prev,
      file,
    }));
  };

  const onEdit = (item) => {
    setEditId(item.id);
    setCurrentImage(item.image || "");
    setForm({
      file: null,
      content: item.content || "",
      order_number: item.order_number || 1,
      is_active: Number(item.is_active ?? 1),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const previewUrl = useMemo(() => {
    if (form.file) return URL.createObjectURL(form.file);
    if (currentImage) return resolveImage(currentImage);
    return "";
  }, [form.file, currentImage]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.content.trim()) {
      return Swal.fire("Error", "Content wajib diisi", "error");
    }

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append("content", form.content);
      fd.append("order_number", String(form.order_number || 1));
      fd.append("is_active", String(form.is_active ?? 1));

      if (form.file) {
        fd.append("image", form.file);
      }

      if (editId) {
        await updateAim(editId, fd);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Aim berhasil diupdate",
          timer: 1400,
          showConfirmButton: false,
        });
      } else {
        await createAim(fd);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Aim berhasil ditambahkan",
          timer: 1400,
          showConfirmButton: false,
        });
      }

      resetForm();
      loadData();
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.message || "Gagal menyimpan aim", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus aim?",
      text: "Data yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAim(id);
      Swal.fire("Berhasil", "Aim berhasil dihapus", "success");
      loadData();
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.message || "Gagal menghapus aim", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e9c2d]">Aims Management</h1>
          <p className="text-gray-500">Kelola aims beserta gambar pada homepage.</p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl border hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-white border rounded-2xl p-5 shadow-sm mb-8 space-y-4"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="w-full border rounded-xl px-3 py-2 mt-1"
            />

            {previewUrl && (
              <div className="mt-3 border rounded-xl overflow-hidden">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-full h-56 object-cover"
                />
              </div>
            )}

            {editId && !form.file && currentImage && (
              <div className="mt-2 text-xs text-gray-500">
                Gambar saat ini: {currentImage}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={onChange}
                rows={7}
                className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1e9c2d]"
                placeholder="Masukkan isi aims..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Order</label>
                <input
                  type="number"
                  name="order_number"
                  value={form.order_number}
                  onChange={onChange}
                  min={1}
                  className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1e9c2d]"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  name="is_active"
                  value={form.is_active}
                  onChange={onChange}
                  className="w-full border rounded-xl px-3 py-2 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#1e9c2d]"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#1e9c2d] text-white px-4 py-2 rounded-xl disabled:opacity-60"
              >
                {submitting ? "Menyimpan..." : editId ? "Update" : "Tambah"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl border"
                >
                  Batal
                </button>
              )}
            </div>

            {editId && (
              <div className="text-xs text-gray-500">
                * Kalau tidak upload file baru, gambar lama tetap dipakai.
              </div>
            )}
          </div>
        </div>
      </form>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="text-gray-500">Belum ada data aims.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {rows.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-2xl overflow-hidden shadow-sm"
            >
              {item.image ? (
                <img
                  src={resolveImage(item.image)}
                  alt="aim"
                  className="w-full h-52 object-cover"
                />
              ) : (
                <div className="w-full h-52 bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-sm text-gray-800 whitespace-pre-line line-clamp-5">
                      {item.content}
                    </div>

                    <div className="text-xs text-gray-500 mt-2">
                      order: {item.order_number} • status:{" "}
                      <span className={item.is_active ? "text-[#1e9c2d]" : "text-gray-400"}>
                        {item.is_active ? "active" : "inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </div>

                {item.image && (
                  <div className="mt-2 text-xs text-gray-500 break-all">
                    {item.image}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}