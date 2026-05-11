import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL;

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

  return {
    Authorization: `Bearer ${token}`,

    ...(type === "multipart" && {
      "Content-Type":
        "multipart/form-data",
    }),

    ...(type === "json" && {
      "Content-Type":
        "application/json",
    }),
  };
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
  console.log(
    "POST URL:",
    API
  );

  return axios.post(API, data, {
    headers: getAuthHeaders(
      "multipart"
    ),
  });
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