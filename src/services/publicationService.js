import axios from "axios";

const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

export const getPublications = ({ page = 1, limit = 10, sort = "year_desc", search = "" } = {}) =>
  axios.get(`${API_BASE_URL}/api/publications`, { params: { page, limit, sort, search }, timeout: 10000 });

export const createPublication = (payload) =>
  axios.post(`${API_BASE_URL}/api/publications`, payload, { timeout: 10000 });

export const updatePublication = (id, payload) =>
  axios.put(`${API_BASE_URL}/api/publications/${id}`, payload, { timeout: 10000 });

export const deletePublication = (id) =>
  axios.delete(`${API_BASE_URL}/api/publications/${id}`, { timeout: 10000 });