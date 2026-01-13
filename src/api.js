import axios from "axios";

// const API_BASE = "http://localhost:5000/api";

const API_BASE = "https://api.pmgrandco.com/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  try {
    let token = localStorage.getItem("adminToken");
    if (token) {
      // remove accidental surrounding quotes and whitespace
      token = token.toString().trim().replace(/^"|"$/g, "");
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.warn("api interceptor token read error:", e);
  }
  return config;
}, (err) => Promise.reject(err));

export default api;
