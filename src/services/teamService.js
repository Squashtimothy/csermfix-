import axios from "axios";

const API = "http://localhost:5000/api/teams";

const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
    ...(isMultipart && { "Content-Type": "multipart/form-data" }),
  };
};

export const getTeams = () => axios.get(API);

export const createTeam = (data) =>
  axios.post(API, data, { headers: getAuthHeaders(true) });

export const updateTeam = (id, data) =>
  axios.put(`${API}/${id}`, data, { headers: getAuthHeaders(true) });

export const deleteTeam = (id) =>
  axios.delete(`${API}/${id}`, { headers: getAuthHeaders() });
