import axios from "axios";

let getAccessToken: (() => string | null) | null = null;

export function setAuthContextGetter(fn: () => string | null) {
  getAccessToken = fn;
}

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // importante para mandar cookies (refreshToken)
});

// Interceptor para adicionar Authorization header
api.interceptors.request.use((config) => {
  if (getAccessToken) {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
