import axios from "axios";

/* =========================
   BASE URL
========================= */

const API_BASE_URL = (
  process.env.REACT_APP_API_URL ||
  "https://resilient-balance-production-57f8.up.railway.app"
).replace(/\/$/, "");

/* =========================
   AUTH HEADER
========================= */

const authHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* =========================
   AXIOS INSTANCE
========================= */

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

/* =========================
   PUBLICATIONS - GET
========================= */

export const getPublications = async ({
  page = 1,
  limit = 10,
  sort = "year_desc",
  search = "",
  archived = false,
} = {}) => {

  const response = await api.get("/publications", {
    params: {
      page,
      limit,
      sort,
      search,
      archived,
    },
  });

  return response.data;
};

/* =========================
   PUBLICATIONS - CREATE
========================= */

export const createPublication = async (payload) => {

  const response = await api.post(
    "/publications",
    payload,
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};

/* =========================
   PUBLICATIONS - UPDATE
========================= */

export const updatePublication = async (
  id,
  payload
) => {

  const response = await api.put(
    `/publications/${id}`,
    payload,
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};

/* =========================
   PUBLICATIONS - DELETE
========================= */

export const deletePublication = async (id) => {

  const response = await api.delete(
    `/publications/${id}`,
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};

/* =========================
   PUBLICATIONS - ARCHIVE
========================= */

export const archivePublication = async (id) => {

  const response = await api.patch(
    `/publications/${id}/archive`,
    {},
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};

/* =========================
   PUBLICATIONS - RESTORE
========================= */

export const unarchivePublication = async (id) => {

  const response = await api.patch(
    `/publications/${id}/restore`,
    {},
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};