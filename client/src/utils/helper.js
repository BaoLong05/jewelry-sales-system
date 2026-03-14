import axios from "axios";

export const API_BASE_URL = "http://192.168.33.11:8000/api";

export const apiUrl = (endpoint) => `${API_BASE_URL}/${endpoint}`;

//Auth
//1.dang ky
export const addRegister = async (data) => {
  const res = await axios.post(apiUrl("register"), data);
  return res.data;
};
