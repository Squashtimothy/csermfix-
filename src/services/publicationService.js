import axios from "axios";

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
   PUBLICATIONS - PUBLIC
========================= */

export const getPublications = async ({
  page = 1,
  limit = 10,
  sort = "year_desc",
  search = "",
} = {}) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/publications`,
    {
      params: {
        page,
        limit,
        sort,
        search,
      },
      timeout: 10000,
    }
  );

  return response.data;
};

/* =========================
   PUBLICATIONS - ADMIN
========================= */

export const createPublication = async (payload) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/publications`,
    payload,
    {
      headers: authHeaders(),
      timeout: 10000,
    }
  );

  return response.data;
};

export const updatePublication = async (id, payload) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/publications/${id}`,
    payload,
    {
      headers: authHeaders(),
      timeout: 10000,
    }
  );

  return response.data;
};

export const deletePublication = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URL}/api/publications/${id}`,
    {
      headers: authHeaders(),
      timeout: 10000,
    }
  );

  return response.data;
};