import axios from "axios";

const API_URL = "http://localhost:5000/api/profile"; 
// sesuaikan dengan backend kamu

export const getProfileContent = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const updateProfileContent = async (data, token) => {
  const response = await axios.put(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};