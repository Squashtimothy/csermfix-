import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

/* ================= LOGIN ================= */
export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    username,
    password,
  });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
  }

  return response.data;
};

/* ================= AUTH HELPERS ================= */
export const getToken = () => {
  return localStorage.getItem("token");
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
