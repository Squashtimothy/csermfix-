import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

export default function HomepageManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  /* =========================
     LOAD DATA
  ========================= */
  const load = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/homepage/profile`);
      if (!res.ok) throw new Error("Gagal fetch profile");

      const data = await res.json();

      setForm({
        title: data?.title || "",
        description: data?.description || data?.content || "",
      });
    } catch (e) {
      Swal.fire("Error", e.message || "Gagal load profile homepage", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
     SAVE PROFILE
  ========================= */
  const onSave = async () => {
    if (!token) {
      return Swal.fire("Forbidden", "Token tidak ada. Silakan login ulang.", "warning");
    }

    const title = form.title?.trim();
    const description = form.description?.trim();

    if (!title || !description) {
      return Swal.fire("Error", "Title & description wajib diisi", "error");
    }

    try {
      setSaving(true);

      const res = await fetch(`${API_BASE}/api/homepage/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      let out = {};
      try {
        out = await res.json();
      } catch {
        // kalau backend tidak kirim JSON
      }

      if (!res.ok) {
        throw new Error(out?.message || "Gagal simpan profile");
      }

      Swal.fire("Success", "Profile homepage berhasil disimpan", "success");
      await load();
    } catch (e) {
      Swal.fire("Error", e.message || "Gagal simpan profile homepage", "error");
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     UI
  ========================= */
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1E9C2D]">
          Kelola Homepage - Profile
        </h1>

        <button
          onClick={onSave}
          disabled={saving}
          className="bg-[#1E9C2D] text-white px-5 py-2 rounded-xl disabled:opacity-60 hover:opacity-90 transition"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Judul</label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E9C2D]"
            placeholder="Contoh: CENTRE FOR SUSTAINABLE ENERGY..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={10}
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E9C2D]"
            placeholder="Isi deskripsi profile..."
          />
          <div className="text-xs text-gray-500 mt-2">
            Tips: pakai Enter untuk paragraf baru (nanti di public bisa render pakai{" "}
            <code>whitespace-pre-line</code>).
          </div>
        </div>
      </div>
    </div>
  );
}