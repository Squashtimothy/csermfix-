import axios from "axios";

const API = "http://localhost:5000/api/news";

// ==================== AUTH HEADER ====================
const getAuthHeaders = (type = "json") => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token tidak ditemukan. Silakan login kembali.");
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,

    //   HANDLE CONTENT TYPE
    ...(type === "multipart" && {
      "Content-Type": "multipart/form-data",
    }),

    ...(type === "json" && {
      "Content-Type": "application/json",
    }),
  };
};

// ==================== GET ====================

//   ADMIN → semua data (draft + published)
export const getNews = async () => {
  return axios.get(API, {
    headers: getAuthHeaders(),
  });
};

//   USER → hanya published
export const getPublishedNews = async () => {
  return axios.get(`${API}/published`);
};

// ==================== CREATE ====================
export const createNews = async (data) => {
  return axios.post(API, data, {
    headers: getAuthHeaders("multipart"),
  });
};

// ==================== UPDATE FULL ====================
export const updateNews = async (id, data) => {
  return axios.put(`${API}/${id}`, data, {
    headers: getAuthHeaders("multipart"),
  });
};

// ====================   UPDATE STATUS ONLY ====================
export const updateNewsStatus = async (id, status) => {
  return axios.patch(
    `${API}/${id}/status`,
    { status }, //   kirim JSON
    {
      headers: getAuthHeaders("json"), //   WAJIB JSON
    }
  );
};

// ==================== DELETE ====================
export const deleteNews = async (id) => {
  return axios.delete(`${API}/${id}`, {
    headers: getAuthHeaders(),
  });
};