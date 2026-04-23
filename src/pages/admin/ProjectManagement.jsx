import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
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

/* ================= INIT ================= */
const initialProjectForm = {
  file: null,
  title: "",
  short_description: "",
};

const initialBlockForm = {
  file: null,
  title: "",
  content: "",
};

/* ================= COMPONENT ================= */
export default function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [blocks, setBlocks] = useState([]);

  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [blockForm, setBlockForm] = useState(initialBlockForm);

  const [editProjectId, setEditProjectId] = useState(null);
  const [editBlockId, setEditBlockId] = useState(null);

  /* ================= LOAD ================= */
  const loadProjects = useCallback(async () => {
    try {
      const res = await getProjectsAdmin();
      const data = res?.data?.data || res?.data || [];
      setProjects(data);
      if (data.length > 0) setSelectedProjectId(data[0].id);
    } catch {
      Swal.fire("Error", "Gagal load project", "error");
    }
  }, []);

  const loadBlocks = useCallback(async (id) => {
    if (!id) return;
    try {
      const res = await getProjectBlocksAdmin(id);
      const data = res?.data?.data || res?.data || [];
      setBlocks(data);
    } catch {
      Swal.fire("Error", "Gagal load block", "error");
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    loadBlocks(selectedProjectId);
  }, [selectedProjectId, loadBlocks]);

  /* ================= HANDLER ================= */
  const onProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const onBlockChange = (e) => {
    const { name, value } = e.target;
    setBlockForm((prev) => ({ ...prev, [name]: value }));
  };

  const onProjectFileChange = (e) => {
    setProjectForm((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const onBlockFileChange = (e) => {
    setBlockForm((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  /* ================= SUBMIT ================= */
  const onSubmitProject = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    Object.entries(projectForm).forEach(([key, val]) => {
      if (val) fd.append(key, val);
    });

    try {
      if (editProjectId) {
        await updateProject(editProjectId, fd);
      } else {
        await createProject(fd);
      }

      Swal.fire("Success", "Project berhasil disimpan", "success");
      setProjectForm(initialProjectForm);
      setEditProjectId(null);
      loadProjects();
    } catch {
      Swal.fire("Error", "Gagal simpan project", "error");
    }
  };

  const onSubmitBlock = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    Object.entries(blockForm).forEach(([key, val]) => {
      if (val) fd.append(key, val);
    });

    try {
      if (editBlockId) {
        await updateProjectBlock(editBlockId, fd);
      } else {
        await createProjectBlock(selectedProjectId, fd);
      }

      Swal.fire("Success", "Block berhasil disimpan", "success");
      setBlockForm(initialBlockForm);
      setEditBlockId(null);
      loadBlocks(selectedProjectId);
    } catch {
      Swal.fire("Error", "Gagal simpan block", "error");
    }
  };

  const onDeleteProject = async (id) => {
    await deleteProject(id);
    loadProjects();
  };

  const onDeleteBlock = async (id) => {
    await deleteProjectBlock(id);
    loadBlocks(selectedProjectId);
  };

  /* ================= PREVIEW ================= */
  const projectPreview = useMemo(() => {
    if (projectForm.file) return URL.createObjectURL(projectForm.file);
    return "";
  }, [projectForm.file]);

  const blockPreview = useMemo(() => {
    if (blockForm.file) return URL.createObjectURL(blockForm.file);
    return "";
  }, [blockForm.file]);

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-10">

      {/* PROJECT FORM */}
      <form onSubmit={onSubmitProject} className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Project</h2>

        <input
          name="title"
          placeholder="Title"
          onChange={onProjectChange}
          value={projectForm.title}
          className="w-full border p-2 mb-2 rounded"
        />

        <textarea
          name="short_description"
          placeholder="Short Description"
          onChange={onProjectChange}
          value={projectForm.short_description}
          className="w-full border p-2 mb-2 rounded"
        />

        <input type="file" onChange={onProjectFileChange} />

        {projectPreview && (
          <img
            src={projectPreview}
            alt="Project Preview"
            className="w-40 mt-3"
          />
        )}

        <button className="bg-green-600 text-white px-4 py-2 mt-3 rounded">
          Save Project
        </button>
      </form>

      {/* PROJECT LIST */}
      <div>
        <h2 className="text-xl font-bold mb-2">Projects</h2>

        {projects.map((p) => (
          <div key={p.id} className="border p-3 mb-2 flex justify-between">
            <span>{p.title}</span>

            <div className="flex gap-2">
              <button onClick={() => setSelectedProjectId(p.id)}>
                Blocks
              </button>
              <button onClick={() => onDeleteProject(p.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BLOCK FORM */}
      <form onSubmit={onSubmitBlock} className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Block</h2>

        <input
          name="title"
          placeholder="Title"
          onChange={onBlockChange}
          value={blockForm.title}
          className="w-full border p-2 mb-2 rounded"
        />

        <textarea
          name="content"
          placeholder="Content"
          onChange={onBlockChange}
          value={blockForm.content}
          className="w-full border p-2 mb-2 rounded"
        />

        <input type="file" onChange={onBlockFileChange} />

        {blockPreview && (
          <img
            src={blockPreview}
            alt="Block Preview"
            className="w-40 mt-3"
          />
        )}

        <button className="bg-blue-600 text-white px-4 py-2 mt-3 rounded">
          Save Block
        </button>
      </form>

      {/* BLOCK LIST */}
      <div>
        <h2 className="text-xl font-bold mb-2">Blocks</h2>

        {blocks.map((b) => (
          <div key={b.id} className="border p-3 mb-2 flex justify-between">
            <span>{b.title}</span>
            <button onClick={() => onDeleteBlock(b.id)}>Delete</button>
          </div>
        ))}
      </div>

    </div>
  );
}