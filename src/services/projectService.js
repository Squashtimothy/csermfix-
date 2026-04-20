import axios from "axios";

const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const resolveProjectImage = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_BASE}/uploads/${image}`;
};

/* =========================
   PAGE SETTINGS
========================= */

export const getProjectPageSettings = () =>
  axios.get(`${API_BASE}/api/projects/page-settings`);

export const updateProjectPageSettings = (formData) =>
  axios.put(`${API_BASE}/api/projects/page-settings`, formData, {
    headers: { ...authHeaders() },
  });

/* =========================
   PROJECTS - PUBLIC
========================= */

export const getProjects = () =>
  axios.get(`${API_BASE}/api/projects`);

export const getFeaturedProject = () =>
  axios.get(`${API_BASE}/api/projects/featured`);

export const getProjectById = (id) =>
  axios.get(`${API_BASE}/api/projects/${id}`);

/* =========================
   PROJECTS - ADMIN
========================= */

export const getProjectsAdmin = () =>
  axios.get(`${API_BASE}/api/projects/admin/all`, {
    headers: authHeaders(),
  });

export const createProject = (formData) =>
  axios.post(`${API_BASE}/api/projects`, formData, {
    headers: { ...authHeaders() },
  });

export const updateProject = (id, formData) =>
  axios.put(`${API_BASE}/api/projects/${id}`, formData, {
    headers: { ...authHeaders() },
  });

export const deleteProject = (id) =>
  axios.delete(`${API_BASE}/api/projects/${id}`, {
    headers: authHeaders(),
  });

/* =========================
   PROJECT BLOCKS - PUBLIC
========================= */

export const getProjectBlocks = (projectId) =>
  axios.get(`${API_BASE}/api/projects/${projectId}/blocks`);

/* =========================
   PROJECT BLOCKS - ADMIN
========================= */

export const getProjectBlocksAdmin = (projectId) =>
  axios.get(`${API_BASE}/api/projects/${projectId}/blocks/admin`, {
    headers: authHeaders(),
  });

export const createProjectBlock = (projectId, formData) =>
  axios.post(`${API_BASE}/api/projects/${projectId}/blocks`, formData, {
    headers: { ...authHeaders() },
  });

export const updateProjectBlock = (blockId, formData) =>
  axios.put(`${API_BASE}/api/projects/blocks/${blockId}`, formData, {
    headers: { ...authHeaders() },
  });

export const deleteProjectBlock = (blockId) =>
  axios.delete(`${API_BASE}/api/projects/blocks/${blockId}`, {
    headers: authHeaders(),
  });