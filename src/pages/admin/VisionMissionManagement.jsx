import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  getVisionMission,
  updateVisionMission,
  resolveImage,
} from "../../services/homepageService";

export default function VisionMissionManagement() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [currentImage, setCurrentImage] = useState("");

  const [form, setForm] = useState({
    file: null,
    vision_title: "Vision",
    vision_text: "",
    mission_title: "Mission",
    mission_text: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getVisionMission();
      const data = res?.data || {};

      setForm({
        file: null,
        vision_title: data?.vision_title || "Vision",
        vision_text: data?.vision_text || "",
        mission_title: data?.mission_title || "Mission",
        mission_text: data?.mission_text || "",
      });

      setCurrentImage(data?.image || "");
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Gagal memuat Vision & Mission",
        "error"
      );
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
      [name]: value,
    }));
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({
      ...prev,
      file,
    }));
  };

  const previewUrl = useMemo(() => {
    if (form.file) return URL.createObjectURL(form.file);
    if (currentImage) return resolveImage(currentImage);
    return "";
  }, [form.file, currentImage]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.vision_text.trim() || !form.mission_text.trim()) {
      return Swal.fire(
        "Error",
        "Vision text dan Mission text wajib diisi",
        "error"
      );
    }

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append("vision_title", form.vision_title || "Vision");
      fd.append("vision_text", form.vision_text);
      fd.append("mission_title", form.mission_title || "Mission");
      fd.append("mission_text", form.mission_text);

      if (form.file) {
        fd.append("image", form.file);
      }

      await updateVisionMission(fd);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Vision & Mission berhasil diupdate",
        timer: 1500,
        showConfirmButton: false,
      });

      loadData();
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Gagal mengupdate Vision & Mission",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e9c2d]">
            Vision & Mission Management
          </h1>
          <p className="text-gray-500">
            Kelola konten Vision & Mission pada homepage.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl border hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="bg-white border rounded-2xl p-6 shadow-sm space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* LEFT: FORM TEXT */}
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium">Vision Title</label>
                <input
                  type="text"
                  name="vision_title"
                  value={form.vision_title}
                  onChange={onChange}
                  className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1e9c2d]"
                  placeholder="Vision"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Vision Text</label>
                <textarea
                  name="vision_text"
                  value={form.vision_text}
                  onChange={onChange}
                  rows={6}
                  className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1e9c2d]"
                  placeholder="Masukkan teks vision..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Mission Title</label>
                <input
                  type="text"
                  name="mission_title"
                  value={form.mission_title}
                  onChange={onChange}
                  className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1e9c2d]"
                  placeholder="Mission"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Mission Text</label>
                <textarea
                  name="mission_text"
                  value={form.mission_text}
                  onChange={onChange}
                  rows={6}
                  className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1e9c2d]"
                  placeholder="Masukkan teks mission..."
                />
              </div>
            </div>

            {/* RIGHT: IMAGE */}
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="w-full border rounded-xl px-3 py-2 mt-1"
                />
              </div>

              {previewUrl ? (
                <div className="border rounded-2xl overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Vision Mission Preview"
                    className="w-full h-[420px] object-cover"
                  />
                </div>
              ) : (
                <div className="border rounded-2xl h-[420px] flex items-center justify-center text-gray-400 bg-gray-50">
                  No Image
                </div>
              )}

              {currentImage && !form.file && (
                <div className="text-xs text-gray-500 break-all">
                  Gambar saat ini: {currentImage}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#1e9c2d] text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-60"
            >
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}