import axios from "axios";

const API_BASE = (
  process.env.REACT_APP_API_URL ||
  "https://resilient-balance-production-57f8.up.railway.app"
).replace(/\/$/, "");

/* =========================
   AUTH HEADER
========================= */

const authHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    ...(isMultipart && {
      "Content-Type": "multipart/form-data",
    }),
  };
};

/* =========================
   RESOLVE IMAGE
========================= */

export const resolveProjectImage = (image) => {
  if (!image) return "";

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${API_BASE}/uploads/${image}`;
};

/* =========================
   PAGE SETTINGS
========================= */

export const getProjectPageSettings = async () => {
  const response = await axios.get(
    `${API_BASE}/api/projects/page-settings`
  );

  return response.data;
};

export const updateProjectPageSettings = async (formData) => {
  const response = await axios.put(
    `${API_BASE}/api/projects/page-settings`,
    formData,
    {
      headers: authHeaders(true),
    }
  );

  return response.data;
};

/* =========================
   PROJECTS - PUBLIC
========================= */

export const getProjects = async () => {
  const response = await axios.get(
    `${API_BASE}/api/projects`
  );

  return response.data;
};

export const getFeaturedProject = async () => {
  const response = await axios.get(
    `${API_BASE}/api/projects/featured`
  );

  return response.data;
};

export const getProjectById = async (id) => {
  const response = await axios.get(
    `${API_BASE}/api/projects/${id}`
  );

  return response.data;
};

/* =========================
   PROJECTS - ADMIN
========================= */

export const getProjectsAdmin = async () => {
  const response = await axios.get(
    `${API_BASE}/api/projects/admin/all`,
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};

export const createProject = async (formData) => {
  const response = await axios.post(
    `${API_BASE}/api/projects`,
    formData,
    {
      headers: authHeaders(true),
    }
  );

  return response.data;
};

export const updateProject = async (id, formData) => {
  const response = await axios.put(
    `${API_BASE}/api/projects/${id}`,
    formData,
    {
      headers: authHeaders(true),
    }
  );

  return response.data;
};

export const deleteProject = async (id) => {
  const response = await axios.delete(
    `${API_BASE}/api/projects/${id}`,
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};

/* =========================
   PROJECT BLOCKS - PUBLIC
========================= */

export const getProjectBlocks = async (projectId) => {
  const response = await axios.get(
    `${API_BASE}/api/projects/${projectId}/blocks`
  );

  return response.data;
};

/* =========================
   PROJECT BLOCKS - ADMIN
========================= */

export const getProjectBlocksAdmin = async (projectId) => {
  const response = await axios.get(
    `${API_BASE}/api/projects/${projectId}/blocks/admin`,
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};

export const createProjectBlock = async (
  projectId,
  formData
) => {
  const response = await axios.post(
    `${API_BASE}/api/projects/${projectId}/blocks`,
    formData,
    {
      headers: authHeaders(true),
    }
  );

  return response.data;
};

export const updateProjectBlock = async (
  blockId,
  formData
) => {
  const response = await axios.put(
    `${API_BASE}/api/projects/blocks/${blockId}`,
    formData,
    {
      headers: authHeaders(true),
    }
  );

  return response.data;
};

export const deleteProjectBlock = async (blockId) => {
  const response = await axios.delete(
    `${API_BASE}/api/projects/blocks/${blockId}`,
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};