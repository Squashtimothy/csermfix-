import axios from "axios";

/* =========================
   BASE URL
========================= */

const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://resilient-balance-production-57f8.up.railway.app";

const API = `${BASE_URL}/api/news`;

console.log("BASE_URL:", BASE_URL);
console.log("NEWS API:", API);

/* =========================
   AUTH HEADER
========================= */

const getAuthHeaders = (
  type = "json"
) => {
  const token =
    localStorage.getItem("token");

  console.log("TOKEN:", token);

  // TOKEN TIDAK ADA
  if (!token) {
    console.error(
      "Token tidak ditemukan"
    );

    return {};
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // JSON
  if (type === "json") {
    headers["Content-Type"] =
      "application/json";
  }

  // MULTIPART
  // JANGAN SET MANUAL multipart/form-data
  // biarkan browser generate boundary
  return headers;
};

/* =========================
   GET ALL
========================= */

export const getNews = async () => {
  return axios.get(API, {
    headers: getAuthHeaders(),
  });
};

/* =========================
   GET PUBLISHED
========================= */

export const getPublishedNews =
  async () => {
    return axios.get(
      `${API}/published`
    );
  };

/* =========================
   CREATE
========================= */

export const createNews = async (
  data
) => {
  try {
    console.log("POST URL:", API);

    return await axios.post(
      API,
      data,
      {
        headers:
          getAuthHeaders(
            "multipart"
          ),
      }
    );
  } catch (err) {
    console.error(
      "CREATE NEWS ERROR:",
      err
    );

    console.error(
      "ERROR RESPONSE:",
      err.response?.data
    );

    throw err;
  }
};

/* =========================
   UPDATE
========================= */

export const updateNews = async (
  id,
  data
) => {
  return axios.put(
    `${API}/${id}`,
    data,
    {
      headers:
        getAuthHeaders(
          "multipart"
        ),
    }
  );
};

/* =========================
   UPDATE STATUS
========================= */

export const updateNewsStatus =
  async (id, status) => {
    return axios.patch(
      `${API}/${id}/status`,
      { status },
      {
        headers:
          getAuthHeaders(
            "json"
          ),
      }
    );
  };

/* =========================
   DELETE
========================= */

export const deleteNews = async (
  id
) => {
  return axios.delete(
    `${API}/${id}`,
    {
      headers:
        getAuthHeaders(),
    }
  );
};