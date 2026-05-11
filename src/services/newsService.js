import axios from "axios";

const API_BASE = (
  process.env.REACT_APP_API_URL ||
  "https://resilient-balance-production-57f8.up.railway.app"
).replace(/\/$/, "");

/* =========================================
   AXIOS INSTANCE
========================================= */

const api = axios.create({
  baseURL: API_BASE,
});

/* =========================================
   TOKEN
========================================= */

const getToken = () => {
  return localStorage.getItem("token");
};

/* =========================================
   HEADERS
========================================= */

const authHeaders = (multipart = false) => {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
    ...(multipart && {
      "Content-Type": "multipart/form-data",
    }),
  };
};

/* =========================================
   RESOLVE IMAGE
========================================= */

export const resolveImage = (image) => {
  if (!image) {
    return "https://via.placeholder.com/400x200?text=No+Image";
  }

  // jika sudah full URL
  if (image.startsWith("http")) {
    return image;
  }

  // hapus slash depan
  const clean = image.replace(/^\/+/, "");

  return `${API_BASE}/uploads/${clean}`;
};

/* =========================================
   GET NEWS
========================================= */

export const getNews = async () => {
  try {
    const response = await api.get(
      "/api/news",
      {
        headers: authHeaders(),
      }
    );

    console.log(
      "GET NEWS RESPONSE:",
      response.data
    );

    // FIX ARRAY
    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (
      response.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    }

    return [];
  } catch (err) {
    console.error("GET NEWS ERROR:", err);

    return [];
  }
};

/* =========================================
   GET PUBLISHED NEWS
========================================= */

export const getPublishedNews = async () => {
  try {
    const response = await api.get(
      "/api/news/published"
    );

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (
      response.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    }

    return [];
  } catch (err) {
    console.error(
      "GET PUBLISHED NEWS ERROR:",
      err
    );

    return [];
  }
};

/* =========================================
   GET DETAIL
========================================= */

export const getNewsById = async (id) => {
  const response = await api.get(
    `/api/news/${id}`
  );

  return response.data;
};

/* =========================================
   CREATE
========================================= */

export const createNews = async (
  formData
) => {
  const response = await api.post(
    "/api/news",
    formData,
    {
      headers: authHeaders(true),
    }
  );

  return response.data;
};

/* =========================================
   UPDATE
========================================= */

export const updateNews = async (
  id,
  formData
) => {
  const response = await api.put(
    `/api/news/${id}`,
    formData,
    {
      headers: authHeaders(true),
    }
  );

  return response.data;
};

/* =========================================
   DELETE
========================================= */

export const deleteNews = async (id) => {
  const response = await api.delete(
    `/api/news/${id}`,
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};

/* =========================================
   UPDATE STATUS
========================================= */

export const updateNewsStatus =
  async (id, status) => {
    const response = await api.patch(
      `/api/news/${id}/status`,
      {
        status,
      },
      {
        headers: authHeaders(),
      }
    );

    return response.data;
  };