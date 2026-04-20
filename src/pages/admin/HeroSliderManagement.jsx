import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { createHero, deleteHero, getHeroAdmin, resolveImage, updateHero } from "../../services/homepageService";

export default function HeroSliderManagement() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editId, setEditId] = useState(null);

  // simpan file + meta
  const [form, setForm] = useState({
    file: null,           // <--- file upload
    caption: "",
    order_number: 1,
    is_active: 1,
  });

  // untuk edit: tampilkan image lama
  const [currentImage, setCurrentImage] = useState("");

  const reset = () => {
    setEditId(null);
    setCurrentImage("");
    setForm({ file: null, caption: "", order_number: 1, is_active: 1 });
  };

  const load = async () => {
    try {
      setLoading(true);
      const res = await getHeroAdmin();
      setRows(res.data || []);
    } catch (e) {
      Swal.fire("Error", e?.response?.data?.message || "Gagal load hero", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "order_number" || name === "is_active" ? Number(value) : value,
    }));
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setForm((p) => ({ ...p, file: f }));
  };

  const onEdit = (item) => {
    setEditId(item.id);
    setCurrentImage(item.image || "");
    setForm({
      file: null, // default tidak ganti gambar
      caption: item.caption || "",
      order_number: item.order_number || 1,
      is_active: Number(item.is_active ?? 1),
    });
  };

  const previewUrl = useMemo(() => {
    if (form.file) return URL.createObjectURL(form.file);
    if (currentImage) return resolveImage(currentImage);
    return "";
  }, [form.file, currentImage]);

  const onSubmit = async (e) => {
    e.preventDefault();

    // saat create: wajib file
    if (!editId && !form.file) {
      return Swal.fire("Error", "File image wajib diupload", "error");
    }

    try {
      setSubmitting(true);

      const fd = new FormData();
      if (form.file) fd.append("image", form.file); // field name harus "image"
      fd.append("caption", form.caption || "");
      fd.append("order_number", String(form.order_number || 1));
      fd.append("is_active", String(form.is_active ?? 1));

      if (editId) {
        await updateHero(editId, fd);
        Swal.fire({ icon: "success", title: "Updated", timer: 1200, showConfirmButton: false });
      } else {
        await createHero(fd);
        Swal.fire({ icon: "success", title: "Created", timer: 1200, showConfirmButton: false });
      }

      reset();
      load();
    } catch (e2) {
      Swal.fire("Error", e2?.response?.data?.message || "Gagal simpan hero", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    const ok = await Swal.fire({
      title: "Hapus hero?",
      text: "Data akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    });
    if (!ok.isConfirmed) return;

    try {
      await deleteHero(id);
      Swal.fire("Terhapus", "Hero berhasil dihapus", "success");
      load();
    } catch (e) {
      Swal.fire("Error", e?.response?.data?.message || "Gagal hapus hero", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e9c2d]">Hero Slider</h1>
          <p className="text-gray-500">Kelola gambar slider di halaman Home.</p>
        </div>
        <button onClick={load} className="px-4 py-2 rounded-xl border hover:bg-gray-50">
          Refresh
        </button>
      </div>

      <form onSubmit={onSubmit} className="bg-white border rounded-2xl p-5 shadow-sm mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
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
                <img src={previewUrl} alt="preview" className="w-full h-44 object-cover" />
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
              <label className="text-sm font-medium">Caption (opsional)</label>
              <input
                name="caption"
                value={form.caption}
                onChange={onChange}
                className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1e9c2d]"
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
                  className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1e9c2d]"
                  min={1}
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
              <button disabled={submitting} className="bg-[#1e9c2d] text-white px-4 py-2 rounded-xl disabled:opacity-60">
                {submitting ? "Menyimpan..." : editId ? "Update" : "Tambah"}
              </button>

              {editId && (
                <button type="button" onClick={reset} className="px-4 py-2 rounded-xl border">
                  Batal
                </button>
              )}
            </div>

            {editId && (
              <div className="text-xs text-gray-500">
                * Kalau tidak upload file baru, gambar tidak berubah.
              </div>
            )}
          </div>
        </div>
      </form>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="text-gray-500">Belum ada hero.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {rows.map((h) => (
            <div key={h.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm">
              <img src={resolveImage(h.image)} alt={h.caption || "hero"} className="w-full h-44 object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{h.caption || <span className="text-gray-400">No caption</span>}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      order: {h.order_number} • status:{" "}
                      <span className={h.is_active ? "text-[#1e9c2d]" : "text-gray-400"}>
                        {h.is_active ? "active" : "inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => onEdit(h)} className="text-sm text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => onDelete(h.id)} className="text-sm text-red-600 hover:underline">
                      Hapus
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-500 break-all">{h.image}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}