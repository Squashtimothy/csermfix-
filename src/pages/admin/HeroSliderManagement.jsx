import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import {
  createHero,
  deleteHero,
  getHeroAdmin,
  resolveImage,
  updateHero,
} from "../../services/homepageService";

export default function HeroSliderManagement() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    file: null,
    caption: "",
    order_number: 1,
    is_active: 1,
  });

  const [currentImage, setCurrentImage] = useState("");

  /* =========================
     RESET
  ========================= */

  const reset = () => {
    setEditId(null);

    setCurrentImage("");

    setForm({
      file: null,
      caption: "",
      order_number: 1,
      is_active: 1,
    });
  };

  /* =========================
     LOAD HERO
  ========================= */

  const load = async () => {
    try {
      setLoading(true);

      const data = await getHeroAdmin();

      console.log("HERO ADMIN:", data);

      // support berbagai bentuk response
      if (Array.isArray(data)) {
        setRows(data);
      } else if (Array.isArray(data?.data)) {
        setRows(data.data);
      } else {
        setRows([]);
      }
    } catch (e) {
      console.error("LOAD HERO ERROR:", e);

      Swal.fire(
        "Error",
        e?.response?.data?.message || "Gagal load hero",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================
     INPUT CHANGE
  ========================= */

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((p) => ({
      ...p,
      [name]:
        name === "order_number" ||
        name === "is_active"
          ? Number(value)
          : value,
    }));
  };

  /* =========================
     FILE CHANGE
  ========================= */

  const onFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    setForm((p) => ({
      ...p,
      file,
    }));
  };

  /* =========================
     EDIT
  ========================= */

  const onEdit = (item) => {
    setEditId(item.id);

    setCurrentImage(item.image || "");

    setForm({
      file: null,
      caption: item.caption || "",
      order_number: item.order_number || 1,
      is_active: Number(item.is_active ?? 1),
    });
  };

  /* =========================
     PREVIEW
  ========================= */

  const previewUrl = useMemo(() => {
    if (form.file) {
      return URL.createObjectURL(form.file);
    }

    if (currentImage) {
      return resolveImage(currentImage);
    }

    return "";
  }, [form.file, currentImage]);

  /* =========================
     SUBMIT
  ========================= */

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!editId && !form.file) {
      return Swal.fire(
        "Error",
        "Image wajib diupload",
        "error"
      );
    }

    try {
      setSubmitting(true);

      const fd = new FormData();

      if (form.file) {
        fd.append("image", form.file);
      }

      fd.append("caption", form.caption || "");

      fd.append(
        "order_number",
        String(form.order_number || 1)
      );

      fd.append(
        "is_active",
        String(form.is_active ?? 1)
      );

      if (editId) {
        await updateHero(editId, fd);

        Swal.fire({
          icon: "success",
          title: "Hero updated",
          timer: 1200,
          showConfirmButton: false,
        });
      } else {
        await createHero(fd);

        Swal.fire({
          icon: "success",
          title: "Hero created",
          timer: 1200,
          showConfirmButton: false,
        });
      }

      reset();

      load();
    } catch (e2) {
      console.error("SAVE HERO ERROR:", e2);

      Swal.fire(
        "Error",
        e2?.response?.data?.message ||
          "Gagal simpan hero",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     DELETE
  ========================= */

  const onDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus hero?",
      text: "Data akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) {
      return;
    }

    try {
      await deleteHero(id);

      Swal.fire(
        "Berhasil",
        "Hero berhasil dihapus",
        "success"
      );

      load();
    } catch (e) {
      console.error("DELETE HERO ERROR:", e);

      Swal.fire(
        "Error",
        e?.response?.data?.message ||
          "Gagal hapus hero",
        "error"
      );
    }
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e9c2d]">
            Hero Slider
          </h1>

          <p className="text-gray-500">
            Kelola gambar slider homepage
          </p>
        </div>

        <button
          onClick={load}
          className="px-4 py-2 border rounded-xl hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* FORM */}

      <form
        onSubmit={onSubmit}
        className="bg-white border rounded-2xl p-5 shadow-sm mb-8"
      >
        <div className="grid md:grid-cols-2 gap-4">

          {/* LEFT */}

          <div>
            <label className="text-sm font-medium">
              Upload Image
            </label>

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
                  className="w-full h-44 object-cover"
                />
              </div>
            )}
          </div>

          {/* RIGHT */}

          <div className="space-y-4">

            <div>
              <label className="text-sm font-medium">
                Caption
              </label>

              <input
                name="caption"
                value={form.caption}
                onChange={onChange}
                className="w-full border rounded-xl px-3 py-2 mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="text-sm font-medium">
                  Order
                </label>

                <input
                  type="number"
                  name="order_number"
                  value={form.order_number}
                  onChange={onChange}
                  className="w-full border rounded-xl px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Status
                </label>

                <select
                  name="is_active"
                  value={form.is_active}
                  onChange={onChange}
                  className="w-full border rounded-xl px-3 py-2 mt-1"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>

            </div>

            <div className="flex gap-2">

              <button
                disabled={submitting}
                className="bg-[#1e9c2d] text-white px-4 py-2 rounded-xl"
              >
                {submitting
                  ? "Menyimpan..."
                  : editId
                  ? "Update"
                  : "Tambah"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={reset}
                  className="border px-4 py-2 rounded-xl"
                >
                  Batal
                </button>
              )}

            </div>

          </div>

        </div>
      </form>

      {/* LIST */}

      {loading ? (
        <div>Loading...</div>
      ) : rows.length === 0 ? (
        <div>Belum ada hero.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">

          {rows.map((hero) => (
            <div
              key={hero.id}
              className="bg-white border rounded-2xl overflow-hidden shadow-sm"
            >

              <img
                src={resolveImage(hero.image)}
                alt="hero"
                className="w-full h-44 object-cover"
              />

              <div className="p-4">

                <div className="font-semibold">
                  {hero.caption || "No caption"}
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  order: {hero.order_number}
                </div>

                <div className="flex gap-3 mt-3">

                  <button
                    onClick={() => onEdit(hero)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(hero.id)}
                    className="text-red-600 text-sm"
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