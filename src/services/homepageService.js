import axios from "axios";

const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const resolveImage = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_BASE}/uploads/${image}`;
};

/* =========================
   HERO
========================= */

// public
export const getHeroPublic = () =>
  axios.get(`${API_BASE}/api/homepage/hero`);

// admin
export const getHeroAdmin = () =>
  axios.get(`${API_BASE}/api/homepage/hero/admin`, {
    headers: authHeaders(),
  });

export const createHero = (formData) =>
  axios.post(`${API_BASE}/api/homepage/hero`, formData, {
    headers: {
      ...authHeaders(),
    },
  });

export const updateHero = (id, formData) =>
  axios.put(`${API_BASE}/api/homepage/hero/${id}`, formData, {
    headers: {
      ...authHeaders(),
    },
  });

export const deleteHero = (id) =>
  axios.delete(`${API_BASE}/api/homepage/hero/${id}`, {
    headers: authHeaders(),
  });

/* =========================
   AIMS
========================= */

// public
export const getAimsPublic = () =>
  axios.get(`${API_BASE}/api/homepage/aims`);

// admin
export const getAimsAdmin = () =>
  axios.get(`${API_BASE}/api/homepage/aims/admin`, {
    headers: authHeaders(),
  });

export const createAim = (formData) =>
  axios.post(`${API_BASE}/api/homepage/aims`, formData, {
    headers: {
      ...authHeaders(),
    },
  });

export const updateAim = (id, formData) =>
  axios.put(`${API_BASE}/api/homepage/aims/${id}`, formData, {
    headers: {
      ...authHeaders(),
    },
  });

export const deleteAim = (id) =>
  axios.delete(`${API_BASE}/api/homepage/aims/${id}`, {
    headers: authHeaders(),
  });

/* =========================
   PROFILE
========================= */

export const getHomepageProfile = () =>
  axios.get(`${API_BASE}/api/homepage/profile`);

export const updateHomepageProfile = (payload) =>
  axios.put(`${API_BASE}/api/homepage/profile`, payload, {
    headers: authHeaders(),
  });

/* =========================
   VISION MISSION
========================= */

export const getVisionMission = () =>
  axios.get(`${API_BASE}/api/homepage/vision-mission`);

export const updateVisionMission = (payload) =>
  axios.put(`${API_BASE}/api/homepage/vision-mission`, payload, {
    headers: authHeaders(),
  });