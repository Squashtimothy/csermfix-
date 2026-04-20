import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  getProjectPageSettings,
  updateProjectPageSettings,
  getProjectsAdmin,
  createProject,
  updateProject,
  deleteProject,
  getProjectBlocksAdmin,
  createProjectBlock,
  updateProjectBlock,
  deleteProjectBlock,
  resolveProjectImage,
} from "../../services/projectService";

const initialProjectForm = {
  file: null,
  title: "",
  slug: "",
  short_description: "",
  full_description: "",
  external_link: "",
  location: "",
  project_date: "",
  is_featured: 0,
  is_active: 1,
  order_number: 1,
};

const initialBlockForm = {
  file: null,
  title: "",
  content: "",
  layout_type: "text-left-image-right",
  image_style: "rounded-2xl",
  order_number: 1,
  is_active: 1,
};

const initialPageSettingsForm = {
  page_title: "",
  page_subtitle: "",
  external_link: "",
  file: null,
};

const normalizeResponseData = (res) => {
  if (!res) return null;
  if (res?.data?.data !== undefined) return res.data.data;
  if (res?.data !== undefined) return res.data;
  return res;
};

export default function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [submittingProject, setSubmittingProject] = useState(false);

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [submittingBlock, setSubmittingBlock] = useState(false);

  const [editProjectId, setEditProjectId] = useState(null);
  const [currentProjectImage, setCurrentProjectImage] = useState("");

  const [editBlockId, setEditBlockId] = useState(null);
  const [currentBlockImage, setCurrentBlockImage] = useState("");

  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [blockForm, setBlockForm] = useState(initialBlockForm);

  const [pageSettingsForm, setPageSettingsForm] = useState(
    initialPageSettingsForm
  );
  const [currentHeroImage, setCurrentHeroImage] = useState("");
  const [loadingPageSettings, setLoadingPageSettings] = useState(true);
  const [submittingPageSettings, setSubmittingPageSettings] = useState(false);

  const resetProjectForm = () => {
    setEditProjectId(null);
    setCurrentProjectImage("");
    setProjectForm(initialProjectForm);
  };

  const resetBlockForm = () => {
    setEditBlockId(null);
    setCurrentBlockImage("");
    setBlockForm(initialBlockForm);
  };

  const getPublicProjectUrl = (project) => {
    if (!project?.id) return "#";
    return `${window.location.origin}/projects/${project.id}`;
  };

  const copyProjectLink = async (project) => {
    try {
      const url = getPublicProjectUrl(project);
      await navigator.clipboard.writeText(url);
      Swal.fire("Berhasil", "Link project berhasil disalin", "success");
    } catch (err) {
      Swal.fire("Error", "Gagal menyalin link project", "error");
    }
  };

  const loadPageSettings = useCallback(async () => {
    try {
      setLoadingPageSettings(true);

      const res = await getProjectPageSettings();
      const data = normalizeResponseData(res);

      setPageSettingsForm({
        page_title: data?.page_title || "",
        page_subtitle: data?.page_subtitle || "",
        external_link: data?.external_link || "",
        file: null,
      });

      setCurrentHeroImage(data?.hero_image || "");
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Gagal memuat project page settings",
        "error"
      );
    } finally {
      setLoadingPageSettings(false);
    }
  }, []);

  const loadProjects = useCallback(
    async (keepSelection = true) => {
      try {
        setLoadingProjects(true);

        const res = await getProjectsAdmin();
        const data = normalizeResponseData(res);
        const rows = Array.isArray(data) ? data : [];

        setProjects(rows);

        if (rows.length === 0) {
          setSelectedProjectId(null);
          setBlocks([]);
          return;
        }

        if (!keepSelection) {
          setSelectedProjectId(rows[0].id);
          return;
        }

        const stillExists = rows.some((item) => item.id === selectedProjectId);

        if (!selectedProjectId || !stillExists) {
          setSelectedProjectId(rows[0].id);
        }
      } catch (err) {
        Swal.fire(
          "Error",
          err?.response?.data?.message || "Gagal memuat project",
          "error"
        );
      } finally {
        setLoadingProjects(false);
      }
    },
    [selectedProjectId]
  );

  const loadBlocks = useCallback(async (projectId) => {
    if (!projectId) {
      setBlocks([]);
      return;
    }

    try {
      setLoadingBlocks(true);
      const res = await getProjectBlocksAdmin(projectId);
      const data = normalizeResponseData(res);
      setBlocks(Array.isArray(data) ? data : []);
    } catch (err) {
      setBlocks([]);
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Gagal memuat block project",
        "error"
      );
    } finally {
      setLoadingBlocks(false);
    }
  }, []);

  useEffect(() => {
    loadPageSettings();
    loadProjects();
  }, [loadPageSettings, loadProjects]);

  useEffect(() => {
    loadBlocks(selectedProjectId);
  }, [selectedProjectId, loadBlocks]);

  const onPageSettingsChange = (e) => {
    const { name, value } = e.target;
    setPageSettingsForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onHeroFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setPageSettingsForm((prev) => ({
      ...prev,
      file,
    }));
  };

  const onProjectChange = (e) => {
    const { name, value } = e.target;

    setProjectForm((prev) => ({
      ...prev,
      [name]: ["is_featured", "is_active", "order_number"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const onBlockChange = (e) => {
    const { name, value } = e.target;

    setBlockForm((prev) => ({
      ...prev,
      [name]: ["is_active", "order_number"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const onProjectFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setProjectForm((prev) => ({ ...prev, file }));
  };

  const onBlockFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setBlockForm((prev) => ({ ...prev, file }));
  };

  const heroPreview = useMemo(() => {
    if (pageSettingsForm.file) {
      return URL.createObjectURL(pageSettingsForm.file);
    }
    if (currentHeroImage) {
      return resolveProjectImage(currentHeroImage);
    }
    return "";
  }, [pageSettingsForm.file, currentHeroImage]);

  const projectPreview = useMemo(() => {
    if (projectForm.file) {
      return URL.createObjectURL(projectForm.file);
    }
    if (currentProjectImage) {
      return resolveProjectImage(currentProjectImage);
    }
    return "";
  }, [projectForm.file, currentProjectImage]);

  const blockPreview = useMemo(() => {
    if (blockForm.file) {
      return URL.createObjectURL(blockForm.file);
    }
    if (currentBlockImage) {
      return resolveProjectImage(currentBlockImage);
    }
    return "";
  }, [blockForm.file, currentBlockImage]);

  useEffect(() => {
    return () => {
      if (pageSettingsForm.file && heroPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(heroPreview);
      }
    };
  }, [heroPreview, pageSettingsForm.file]);

  useEffect(() => {
    return () => {
      if (projectForm.file && projectPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(projectPreview);
      }
    };
  }, [projectPreview, projectForm.file]);

  useEffect(() => {
    return () => {
      if (blockForm.file && blockPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(blockPreview);
      }
    };
  }, [blockPreview, blockForm.file]);

  const onEditProject = (item) => {
    setEditProjectId(item.id);
    setCurrentProjectImage(item.featured_image || "");
    setProjectForm({
      file: null,
      title: item.title || "",
      slug: item.slug || "",
      short_description: item.short_description || "",
      full_description: item.full_description || "",
      external_link: item.external_link || "",
      location: item.location || "",
      project_date: item.project_date || "",
      is_featured: Number(item.is_featured ?? 0),
      is_active: Number(item.is_active ?? 1),
      order_number: Number(item.order_number ?? 1),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onEditBlock = (item) => {
    setEditBlockId(item.id);
    setCurrentBlockImage(item.image || "");
    setBlockForm({
      file: null,
      title: item.title || "",
      content: item.content || "",
      layout_type: item.layout_type || "text-left-image-right",
      image_style: item.image_style || "rounded-2xl",
      order_number: Number(item.order_number ?? 1),
      is_active: Number(item.is_active ?? 1),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmitPageSettings = async (e) => {
    e.preventDefault();

    try {
      setSubmittingPageSettings(true);

      const fd = new FormData();
      fd.append("page_title", pageSettingsForm.page_title.trim());
      fd.append("page_subtitle", pageSettingsForm.page_subtitle.trim());
      fd.append("external_link", pageSettingsForm.external_link.trim());

      if (pageSettingsForm.file) {
        fd.append("image", pageSettingsForm.file);
      }

      await updateProjectPageSettings(fd);
      Swal.fire("Berhasil", "Hero berhasil diupdate", "success");
      await loadPageSettings();
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Gagal menyimpan hero",
        "error"
      );
    } finally {
      setSubmittingPageSettings(false);
    }
  };

  const onSubmitProject = async (e) => {
    e.preventDefault();

    if (!projectForm.title.trim() || !projectForm.short_description.trim()) {
      return Swal.fire(
        "Error",
        "Title dan short description wajib diisi",
        "error"
      );
    }

    try {
      setSubmittingProject(true);

      const fd = new FormData();
      fd.append("title", projectForm.title.trim());
      fd.append("slug", projectForm.slug.trim());
      fd.append("short_description", projectForm.short_description.trim());
      fd.append("full_description", projectForm.full_description.trim());
      fd.append("external_link", projectForm.external_link.trim());
      fd.append("location", projectForm.location.trim());
      fd.append("project_date", projectForm.project_date.trim());
      fd.append("is_featured", String(projectForm.is_featured));
      fd.append("is_active", String(projectForm.is_active));
      fd.append("order_number", String(projectForm.order_number));

      if (projectForm.file) {
        fd.append("image", projectForm.file);
      }

      if (editProjectId) {
        await updateProject(editProjectId, fd);
        Swal.fire("Berhasil", "Project berhasil diupdate", "success");
      } else {
        await createProject(fd);
        Swal.fire("Berhasil", "Project berhasil ditambahkan", "success");
      }

      resetProjectForm();
      await loadProjects();
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Gagal menyimpan project",
        "error"
      );
    } finally {
      setSubmittingProject(false);
    }
  };

  const onDeleteProject = async (id) => {
    const result = await Swal.fire({
      title: "Hapus project?",
      text: "Project dan semua block di dalamnya akan ikut terhapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProject(id);
      Swal.fire("Berhasil", "Project berhasil dihapus", "success");

      resetProjectForm();
      resetBlockForm();

      if (selectedProjectId === id) {
        setSelectedProjectId(null);
      }

      await loadProjects(false);
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Gagal menghapus project",
        "error"
      );
    }
  };

  const onSubmitBlock = async (e) => {
    e.preventDefault();

    if (!selectedProjectId) {
      return Swal.fire("Error", "Pilih project terlebih dahulu", "error");
    }

    if (!blockForm.content.trim()) {
      return Swal.fire("Error", "Content block wajib diisi", "error");
    }

    try {
      setSubmittingBlock(true);

      const fd = new FormData();
      fd.append("title", blockForm.title.trim());
      fd.append("content", blockForm.content.trim());
      fd.append("layout_type", blockForm.layout_type);
      fd.append("image_style", blockForm.image_style);
      fd.append("order_number", String(blockForm.order_number));
      fd.append("is_active", String(blockForm.is_active));

      if (blockForm.file) {
        fd.append("image", blockForm.file);
      }

      if (editBlockId) {
        await updateProjectBlock(editBlockId, fd);
        Swal.fire("Berhasil", "Block berhasil diupdate", "success");
      } else {
        await createProjectBlock(selectedProjectId, fd);
        Swal.fire("Berhasil", "Block berhasil ditambahkan", "success");
      }

      resetBlockForm();
      await loadBlocks(selectedProjectId);
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Gagal menyimpan block",
        "error"
      );
    } finally {
      setSubmittingBlock(false);
    }
  };

  const onDeleteBlock = async (id) => {
    const result = await Swal.fire({
      title: "Hapus block?",
      text: "Block ini akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProjectBlock(id);
      Swal.fire("Berhasil", "Block berhasil dihapus", "success");
      resetBlockForm();
      await loadBlocks(selectedProjectId);
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Gagal menghapus block",
        "error"
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e9c2d]">
            Project Management
          </h1>
          <p className="text-gray-500">
            Hero, project, daftar project, dan blocks dipisah jelas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            loadPageSettings();
            loadProjects(true);
          }}
          className="px-4 py-2 rounded-xl border hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* HERO SECTION */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-800">Hero Section</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ini khusus untuk banner atas halaman project.
          </p>
        </div>

        {loadingPageSettings ? (
          <div className="text-gray-500">Loading hero...</div>
        ) : (
          <form
            onSubmit={onSubmitPageSettings}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Page Title</label>
                <input
                  name="page_title"
                  value={pageSettingsForm.page_title}
                  onChange={onPageSettingsChange}
                  className="w-full border rounded-xl px-3 py-2 mt-1"
                  placeholder="Recent Project"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Page Subtitle</label>
                <textarea
                  name="page_subtitle"
                  value={pageSettingsForm.page_subtitle}
                  onChange={onPageSettingsChange}
                  rows={5}
                  className="w-full border rounded-xl px-3 py-2 mt-1"
                  placeholder="Masukkan subtitle halaman project"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  External Link (Hero)
                </label>
                <input
                  name="external_link"
                  value={pageSettingsForm.external_link}
                  onChange={onPageSettingsChange}
                  className="w-full border rounded-xl px-3 py-2 mt-1"
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link ini bisa dipakai untuk tombol di hero section.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Hero Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onHeroFileChange}
                  className="w-full border rounded-xl px-3 py-2 mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={submittingPageSettings}
                className="bg-[#1e9c2d] text-white px-4 py-2 rounded-xl disabled:opacity-60"
              >
                {submittingPageSettings ? "Menyimpan..." : "Simpan Hero"}
              </button>
            </div>

            <div>
              <label className="text-sm font-medium">Preview Hero</label>

              {heroPreview ? (
                <div className="mt-3 border rounded-xl overflow-hidden">
                  <img
                    src={heroPreview}
                    alt="Hero Preview"
                    className="w-full h-[320px] object-cover"
                  />
                </div>
              ) : (
                <div className="mt-3 border rounded-xl h-[320px] flex items-center justify-center text-gray-400 bg-gray-50">
                  No Hero Image
                </div>
              )}

              {currentHeroImage && !pageSettingsForm.file && (
                <div className="mt-2 text-xs text-gray-500 break-all">
                  Hero image saat ini: {currentHeroImage}
                </div>
              )}

              {pageSettingsForm.external_link && (
                <a
                  href={pageSettingsForm.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex mt-3 text-sm text-[#1e9c2d] hover:underline"
                >
                  Buka External Link Hero
                </a>
              )}
            </div>
          </form>
        )}
      </div>

      {/* PROJECT FORM */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-800">Project Form</h2>
          <p className="text-sm text-gray-500 mt-1">
            Form ini khusus untuk data project dan project cover image.
          </p>
        </div>

        <form onSubmit={onSubmitProject} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  name="title"
                  value={projectForm.title}
                  onChange={onProjectChange}
                  className="w-full border rounded-xl px-3 py-2 mt-1"
                />
              </div>

             

              <div>
                <label className="text-sm font-medium">Short Description</label>
                <textarea
                  name="short_description"
                  value={projectForm.short_description}
                  onChange={onProjectChange}
                  rows={4}
                  className="w-full border rounded-xl px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Full Description</label>
                <textarea
                  name="full_description"
                  value={projectForm.full_description}
                  onChange={onProjectChange}
                  rows={6}
                  className="w-full border rounded-xl px-3 py-2 mt-1"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <input
                    name="location"
                    value={projectForm.location}
                    onChange={onProjectChange}
                    className="w-full border rounded-xl px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Project Date</label>
                  <input
                    name="project_date"
                    value={projectForm.project_date}
                    onChange={onProjectChange}
                    className="w-full border rounded-xl px-3 py-2 mt-1"
                    placeholder="Contoh: 2024 / Jan 2025"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">External Link</label>
                <input
                  name="external_link"
                  value={projectForm.external_link}
                  onChange={onProjectChange}
                  className="w-full border rounded-xl px-3 py-2 mt-1"
                  placeholder="https://..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Order</label>
                  <input
                    type="number"
                    min={1}
                    name="order_number"
                    value={projectForm.order_number}
                    onChange={onProjectChange}
                    className="w-full border rounded-xl px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Featured</label>
                  <select
                    name="is_featured"
                    value={projectForm.is_featured}
                    onChange={onProjectChange}
                    className="w-full border rounded-xl px-3 py-2 mt-1"
                  >
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    name="is_active"
                    value={projectForm.is_active}
                    onChange={onProjectChange}
                    className="w-full border rounded-xl px-3 py-2 mt-1"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Project Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={onProjectFileChange}
                className="w-full border rounded-xl px-3 py-2 mt-1"
              />

              {projectPreview ? (
                <div className="mt-3 border rounded-xl overflow-hidden">
                  <img
                    src={projectPreview}
                    alt="Project Preview"
                    className="w-full h-[420px] object-cover"
                  />
                </div>
              ) : (
                <div className="mt-3 border rounded-xl h-[420px] flex items-center justify-center text-gray-400 bg-gray-50">
                  No Image
                </div>
              )}

              {editProjectId && !projectForm.file && currentProjectImage && (
                <div className="mt-2 text-xs text-gray-500 break-all">
                  Gambar saat ini: {currentProjectImage}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submittingProject}
              className="bg-[#1e9c2d] text-white px-4 py-2 rounded-xl disabled:opacity-60"
            >
              {submittingProject
                ? "Menyimpan..."
                : editProjectId
                ? "Update Project"
                : "Tambah Project"}
            </button>

            {editProjectId && (
              <button
                type="button"
                onClick={resetProjectForm}
                className="px-4 py-2 rounded-xl border"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* DAFTAR PROJECT */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-5">
          Daftar Project
        </h2>

        {loadingProjects ? (
          <div className="text-gray-500">Loading project...</div>
        ) : projects.length === 0 ? (
          <div className="text-gray-500">Belum ada project.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((item) => {
              const publicUrl = getPublicProjectUrl(item);
              const previewImage = item.featured_image
                ? resolveProjectImage(item.featured_image)
                : "";

              return (
                <div
                  key={item.id}
                  className={`border rounded-2xl p-4 transition ${
                    selectedProjectId === item.id
                      ? "border-[#1e9c2d] bg-green-50/40"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg text-slate-800">
                        {item.title}
                      </div>

                      <div className="text-sm text-gray-500 mt-1">
                        {item.location || "-"} • {item.project_date || "-"}
                      </div>

                      <div className="text-sm text-gray-700 mt-2 line-clamp-3">
                        {item.short_description}
                      </div>

                      <div className="text-xs text-gray-500 mt-3">
                        order: {item.order_number} • featured:{" "}
                        {Number(item.is_featured) ? "yes" : "no"} • status:{" "}
                        <span
                          className={
                            Number(item.is_active)
                              ? "text-[#1e9c2d]"
                              : "text-gray-400"
                          }
                        >
                          {Number(item.is_active) ? "active" : "inactive"}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="text-xs font-medium text-gray-500 mb-1">
                          Link Project
                        </div>
                        <div className="text-xs text-[#1e9c2d] break-all">
                          {publicUrl}
                        </div>
                      </div>

                      {item.external_link && (
                        <div className="mt-2">
                          <div className="text-xs font-medium text-gray-500 mb-1">
                            External Link
                          </div>
                          <div className="text-xs text-blue-600 break-all">
                            {item.external_link}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedProjectId(item.id)}
                        className="text-sm text-green-700 hover:underline text-left"
                      >
                        Pilih
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditProject(item)}
                        className="text-sm text-blue-600 hover:underline text-left"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => window.open(publicUrl, "_blank")}
                        className="text-sm text-purple-700 hover:underline text-left"
                      >
                        Lihat Project
                      </button>

                      <button
                        type="button"
                        onClick={() => copyProjectLink(item)}
                        className="text-sm text-amber-700 hover:underline text-left"
                      >
                        Copy Link
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteProject(item.id)}
                        className="text-sm text-red-600 hover:underline text-left"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}