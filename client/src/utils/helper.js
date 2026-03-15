import axios from "axios";

export const BASE_URL = "http://192.168.33.11:8000";
export const API_BASE_URL = `${BASE_URL}/api`;

export const apiUrl = (endpoint) => `${API_BASE_URL}/${endpoint}`;

axios.defaults.withCredentials = true;

// Get CSRF token from cookie
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
};

// Setup axios interceptor to add CSRF token header
axios.interceptors.request.use((config) => {
  const token = getCookie('XSRF-TOKEN');
  if (token) {
    config.headers['X-XSRF-TOKEN'] = token;
  }
  return config;
});

// 1. register
export const addRegister = async (data) => {
  // lấy CSRF cookie trước
  await axios.get(`${BASE_URL}/sanctum/csrf-cookie`);
  
  const res = await axios.post(apiUrl("register"), data);
  return res.data;
};

// 2. login
export const loginUser = async (data) => {

  // lấy CSRF cookie trước
  await axios.get(`${BASE_URL}/sanctum/csrf-cookie`);

  const res = await axios.post(apiUrl("login"), data);
  return res.data;
};

// 3. lấy user
export const getUser = async () => {
  const res = await axios.get(apiUrl("user"));
  return res.data;
};

// 4. logout
export const logoutUser = async () => {
  const res = await axios.post(apiUrl("logout"));
  return res.data;
};