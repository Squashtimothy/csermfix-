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

export const resolveImage = (image) => {
  if (!image) return "";

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${API_BASE}/uploads/${image}`;
};

/* =========================
   HERO
========================= */

// PUBLIC
export const getHeroPublic = async () => {
  const response = await axios.get(
    `${API_BASE}/api/homepage/hero`
  );

  return response.data;
};

// ADMIN
export const getHeroAdmin = async () => {
  const response = await axios.get(
    `${API_BASE}/api/homepage/hero/admin`,
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};

export const createHero = async (formData) => {
  const response = await axios.post(
    `${API_BASE}/api/homepage/hero`,
    formData,
    {
      headers: authHeaders(true),
    }
  );

  return response.data;
};

export const updateHero = async (id, formData) => {
  const response = await axios.put(
    `${API_BASE}/api/homepage/hero/${id}`,
    formData,
    {
      headers: authHeaders(true),
    }
  );

  return response.data;
};

export const deleteHero = async (id) => {
  const response = await axios.delete(
    `${API_BASE}/api/homepage/hero/${id}`,
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};

/* =========================
   AIMS
========================= */

// PUBLIC
export const getAimsPublic = async () => {
  const response = await axios.get(
    `${API_BASE}/api/homepage/aims`
  );

  return response.data;
};

// ADMIN
export const getAimsAdmin = async () => {
  const response = await axios.get(
    `${API_BASE}/api/homepage/aims/admin`,
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};

export const createAim = async (formData) => {
  const response = await axios.post(
    `${API_BASE}/api/homepage/aims`,
    formData,
    {
      headers: authHeaders(true),
    }
  );

  return response.data;
};

export const updateAim = async (id, formData) => {
  const response = await axios.put(
    `${API_BASE}/api/homepage/aims/${id}`,
    formData,
    {
      headers: authHeaders(true),
    }
  );

  return response.data;
};

export const deleteAim = async (id) => {
  const response = await axios.delete(
    `${API_BASE}/api/homepage/aims/${id}`,
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};

/* =========================
   PROFILE
========================= */

export const getHomepageProfile = async () => {
  const response = await axios.get(
    `${API_BASE}/api/homepage/profile`
  );

  return response.data;
};

export const updateHomepageProfile = async (payload) => {
  const response = await axios.put(
    `${API_BASE}/api/homepage/profile`,
    payload,
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};

/* =========================
   VISION MISSION
========================= */

export const getVisionMission = async () => {
  const response = await axios.get(
    `${API_BASE}/api/homepage/vision-mission`
  );

  return response.data;
};

export const updateVisionMission = async (payload) => {
  const response = await axios.put(
    `${API_BASE}/api/homepage/vision-mission`,
    payload,
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};