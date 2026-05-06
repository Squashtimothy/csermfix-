import axios from "axios";

const API = `${
  process.env.REACT_APP_API_URL ||
  "https://resilient-balance-production-57f8.up.railway.app"
}/api/teams`;

/* =========================
   AUTH HEADER
========================= */

const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("token");

  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,

    ...(isMultipart && {
      "Content-Type": "multipart/form-data",
    }),
  };
};

/* =========================
   GET TEAMS
========================= */

export const getTeams = async () => {
  const response = await axios.get(API);

  return response.data;
};

/* =========================
   CREATE TEAM
========================= */

export const createTeam = async (data) => {
  const response = await axios.post(API, data, {
    headers: getAuthHeaders(true),
  });

  return response.data;
};

/* =========================
   UPDATE TEAM
========================= */

export const updateTeam = async (id, data) => {
  const response = await axios.put(
    `${API}/${id}`,
    data,
    {
      headers: getAuthHeaders(true),
    }
  );

  return response.data;
};

/* =========================
   DELETE TEAM
========================= */

export const deleteTeam = async (id) => {
  const response = await axios.delete(
    `${API}/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};