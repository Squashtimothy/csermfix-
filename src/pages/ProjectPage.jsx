import React, { useEffect, useState } from "react";
import {
  getProjectPageSettings,
  getFeaturedProject,
  getProjectBlocks,
  getProjects,
  resolveProjectImage,
} from "../services/projectService";

const getImageClassByStyle = (style) => {
  switch (style) {
    case "rounded-full":
      return "rounded-full w-72 h-72 object-cover shadow-lg";
    case "rounded-xl":
      return "rounded-xl w-full max-w-md h-72 object-cover shadow-lg";
    case "rounded-2xl":
    default:
      return "rounded-2xl w-full max-w-md h-72 object-cover shadow-lg";
  }
};

const normalizeResponseData = (res) => {
  if (!res) return null;
  if (res?.data?.data !== undefined) return res.data.data;
  if (res?.data !== undefined) return res.data;
  return res;
};

const ProjectDetailModal = ({ project, onClose }) => {
  if (!project) return null;

  const projectImage = project?.featured_image
    ? resolveProjectImage(project.featured_image)
    : "";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200">
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 md:px-8 py-4 bg-white/95 backdrop-blur border-b border-slate-200 rounded-t-3xl">
          <div>
            <p className="text-sm font-medium text-[#1E9C2D]">Project Detail</p>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900">
              {project?.title || "Untitled Project"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="p-6 md:p-8">
          {projectImage ? (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 mb-8">
              <img
                src={projectImage}
                alt={project?.title || "Project"}
                className="w-full h-[240px] md:h-[420px] object-cover"
              />
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-slate-100 h-[240px] md:h-[420px] flex items-center justify-center text-slate-400 mb-8">
              No Image
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            {project?.location && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600 font-medium">
                {project.location}
              </span>
            )}
            {project?.project_date && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600 font-medium">
                {project.project_date}
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-green-50 px-4 py-2 text-sm text-[#1E9C2D] font-semibold">
              {Number(project?.is_featured) ? "Featured Project" : "Project"}
            </span>
          </div>

          {project?.short_description && (
            <div className="mb-6">
              
              <p className="text-slate-700 leading-relaxed text-base md:text-lg">
                {project.short_description}
              </p>
            </div>
          )}

          {project?.full_description && (
            <div className="mb-6">
             
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {project.full_description}
              </p>
            </div>
          )}

          {project?.external_link && (
            <div className="pt-2">
            <a
          href={project.external_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#1E9C2D] px-5 py-3 text-white font-semibold hover:bg-green-700 transition-all"
        >
          Visit Project Link
            </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectPage = () => {
  const [pageSettings, setPageSettings] = useState(null);
  const [featuredProject, setFeaturedProject] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [pageError, setPageError] = useState("");
  const [featuredError, setFeaturedError] = useState("");
  const [blocksError, setBlocksError] = useState("");
  const [projectsError, setProjectsError] = useState("");

  useEffect(() => {
    const loadPageSettings = async () => {
      try {
        setLoadingPage(true);
        setPageError("");

        const res = await getProjectPageSettings();
        const data = normalizeResponseData(res);
        setPageSettings(data || null);
      } catch (err) {
        console.error("LOAD PROJECT PAGE SETTINGS ERROR:", err);
        setPageError("Gagal mengambil page settings.");
        setPageSettings(null);
      } finally {
        setLoadingPage(false);
      }
    };

    const loadFeaturedProjectAndBlocks = async () => {
      try {
        setLoadingFeatured(true);
        setFeaturedError("");
        setBlocksError("");
        setBlocks([]);

        const res = await getFeaturedProject();
        const data = normalizeResponseData(res);

        setFeaturedProject(data || null);

        if (data?.id) {
          try {
            setLoadingBlocks(true);
            const blockRes = await getProjectBlocks(data.id);
            const blockData = normalizeResponseData(blockRes);
            setBlocks(Array.isArray(blockData) ? blockData : []);
          } catch (blockErr) {
            console.error("LOAD PROJECT BLOCKS ERROR:", blockErr);
            setBlocksError("Gagal mengambil project blocks.");
            setBlocks([]);
          } finally {
            setLoadingBlocks(false);
          }
        } else {
          setBlocks([]);
        }
      } catch (err) {
        console.error("LOAD FEATURED PROJECT ERROR:", err);
        setFeaturedError("Gagal mengambil featured project.");
        setFeaturedProject(null);
        setBlocks([]);
      } finally {
        setLoadingFeatured(false);
      }
    };

    const loadProjects = async () => {
      try {
        setLoadingProjects(true);
        setProjectsError("");

        const res = await getProjects();
        const data = normalizeResponseData(res);
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("LOAD PROJECTS ERROR:", err);
        setProjectsError("Gagal mengambil daftar project.");
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    loadPageSettings();
    loadFeaturedProjectAndBlocks();
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  // HERO HANYA DARI PAGE SETTINGS
  const heroImageRaw = pageSettings?.hero_image || "";
  const heroImage = heroImageRaw ? resolveProjectImage(heroImageRaw) : "";

  const pageTitle =
    pageSettings?.page_title || featuredProject?.title || "Recent Project";

  const pageSubtitle =
    pageSettings?.page_subtitle ||
    featuredProject?.short_description ||
    "Belum ada deskripsi project.";

  const hasFeaturedProject = !!featuredProject;
  const hasBlocks = Array.isArray(blocks) && blocks.length > 0;
  const hasProjects = Array.isArray(projects) && projects.length > 0;

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-white">
      {/* HERO */}
      <section className="pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-[32px] min-h-[380px] md:min-h-[460px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] bg-slate-200">
            {heroImage ? (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${heroImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-lg bg-slate-100">
                No Hero Image
              </div>
            )}

            <div className="relative z-10 flex items-end min-h-[380px] md:min-h-[460px] px-8 md:px-14 py-10 md:py-14">
              <div className="max-w-3xl">
                <div className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white border border-white/20 mb-5">
                  CSERM UNAS Project
                </div>

                <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                  {pageTitle}
                </h1>

                <p className="mt-4 text-base md:text-xl text-white/90 leading-relaxed max-w-2xl">
                  {pageSubtitle}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {featuredProject?.id && (
                    <button
                      type="button"
                      onClick={() => setSelectedProject(featuredProject)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1E9C2D] px-5 py-3 text-white font-semibold shadow-lg hover:bg-green-700 transition-all"
                    >
                      View Project Details
                      <span>→</span>
                    </button>
                  )}

                  {featuredProject?.external_link && (
                    <a
                      href={featuredProject.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm px-5 py-3 text-white font-semibold hover:bg-white/20 transition-all"
                    >
                      Visit Link

                    </a>
                  )}
                </div>

                {loadingPage && (
                  <p className="text-sm text-white/70 mt-4">
                    Loading page settings...
                  </p>
                )}

                {loadingFeatured && (
                  <p className="text-sm text-white/70 mt-2">
                    Loading featured project...
                  </p>
                )}

                {pageError && (
                  <p className="text-sm text-red-200 mt-3">{pageError}</p>
                )}

                {featuredError && (
                  <p className="text-sm text-red-200 mt-2">{featuredError}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECT SUMMARY */}
      <section className="pb-8">
        <div className="max-w-6xl mx-auto px-6">
          {!hasFeaturedProject ? (
            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-1.5 h-10 rounded-full bg-[#1E9C2D]" />
                    <span className="text-sm uppercase tracking-[0.2em] font-semibold text-[#1E9C2D]">
                      Featured Project
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                    {featuredProject?.title || "Featured Project"}
                  </h2>

                  {(featuredProject?.location || featuredProject?.project_date) && (
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500 font-medium">
                      {featuredProject?.location && (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                          {featuredProject.location}
                        </span>
                      )}
                      {featuredProject?.project_date && (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                          {featuredProject.project_date}
                        </span>
                      )}
                    </div>
                  )}

                  {featuredProject?.short_description && (
                    <p className="mt-6 text-slate-700 leading-relaxed text-lg">
                      {featuredProject.short_description}
                    </p>
                  )}

                  {featuredProject?.full_description && (
                    <p className="mt-4 text-slate-600 leading-relaxed whitespace-pre-line">
                      {featuredProject.full_description}
                    </p>
                  )}

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(featuredProject)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1E9C2D] px-5 py-3 text-white font-semibold hover:bg-green-700 transition-all"
                    >
                      View Project Details
                      <span>→</span>
                    </button>

                    {featuredProject?.external_link && (
                      <a
                        href={featuredProject.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[#1E9C2D] font-semibold hover:text-green-700 transition-all"
                      >
                        Find out more...
                        <span>→</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="lg:pl-4">
                  {featuredProject?.featured_image ? (
                    <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-md bg-slate-100">
                      <img
                        src={resolveProjectImage(featuredProject.featured_image)}
                        alt={featuredProject?.title || "Featured Project"}
                        className="w-full h-[300px] md:h-[380px] object-cover"
                      />
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-slate-200 h-[300px] md:h-[380px] bg-slate-100 flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PROJECT BLOCKS */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        {loadingBlocks ? (
          <div className="text-sm text-slate-500">Loading project blocks...</div>
        ) : blocksError ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-600 font-medium">{blocksError}</p>
          </div>
        ) : !hasFeaturedProject ? null : !hasBlocks ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
            <p className="text-slate-500">Belum ada project blocks.</p>
          </div>
        ) : (
          blocks.map((block, index) => {
            const imageSrc = block?.image
              ? resolveProjectImage(block.image)
              : null;
            const isImageLeft =
              block?.layout_type === "image-left-text-right";
            const imageClass = getImageClassByStyle(block?.image_style);

            return (
              <section key={block?.id || index} className="py-10 md:py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  {isImageLeft && (
                    <div className="flex justify-center order-2 md:order-1">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={block?.title || `Project Block ${index + 1}`}
                          className={imageClass}
                        />
                      ) : (
                        <div className="rounded-2xl w-full max-w-md h-72 bg-slate-100 flex items-center justify-center text-slate-400 shadow-lg">
                          No Image
                        </div>
                      )}
                    </div>
                  )}

                  <div className={isImageLeft ? "order-1 md:order-2" : ""}>
                    <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
                      {block?.title && (
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">
                          {block.title}
                        </h3>
                      )}
                      <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-line">
                        {block?.content || "-"}
                      </p>
                    </div>
                  </div>

                  {!isImageLeft && (
                    <div className="flex justify-center">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={block?.title || `Project Block ${index + 1}`}
                          className={imageClass}
                        />
                      ) : (
                        <div className="rounded-2xl w-full max-w-md h-72 bg-slate-100 flex items-center justify-center text-slate-400 shadow-lg">
                          No Image
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            );
          })
        )}
      </section>

      {/* ALL PROJECTS */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            All Projects
          </h2>
          <p className="text-slate-600 mt-2">
           Click to see the detail.
          </p>
        </div>

        {loadingProjects ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
            <p className="text-slate-500">Loading daftar project...</p>
          </div>
        ) : projectsError ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-600 font-medium">{projectsError}</p>
          </div>
        ) : !hasProjects ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
            <p className="text-slate-500">There are no projects available yet..</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {projects.map((project) => {
              const projectImage = project?.featured_image
                ? resolveProjectImage(project.featured_image)
                : "";

              return (
                <div
                  key={project.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200"
                >
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    {projectImage ? (
                      <img
                        src={projectImage}
                        alt={project.title || "Project"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No Image
                      </div>
                    )}

                    {project?.is_featured ? (
                      <span className="absolute top-4 left-4 bg-[#1E9C2D] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#1E9C2D] transition-colors line-clamp-2">
                      {project.title || "Untitled Project"}
                    </h3>

                    {(project?.location || project?.project_date) && (
                      <div className="text-sm text-slate-500 font-medium mb-3">
                        {[project?.location, project?.project_date]
                          .filter(Boolean)
                          .join(" • ")}
                      </div>
                    )}

                    <p className="text-slate-600 leading-relaxed text-sm line-clamp-3">
                      {project?.short_description || "Belum ada deskripsi."}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="mt-5 inline-flex items-center gap-2 text-[#1E9C2D] font-semibold hover:text-green-700 transition-colors"
                    >
                      See Details
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default ProjectPage;