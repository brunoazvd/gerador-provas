import axios from "axios";
import { refreshAccessToken } from "@api/auth";

type FailedQueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let getAccessToken: (() => string | null) | null = null;
let setAccessToken: ((token: string) => void) | null = null;
let isRefreshing: boolean = false;
let failedQueue: FailedQueueItem[] = [];

export function setAccessTokenGetter(fn: () => string | null) {
  getAccessToken = fn;
}

export function setAccessTokenSetter(fn: (token: string) => void | null) {
  setAccessToken = fn;
}
export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// Interceptor para adicionar Authorization header
api.interceptors.request.use((config) => {
  if (!config.headers.Authorization && getAccessToken) {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor para tentar refreshToken em casos de TOKEN_EXPIRED
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const responseData = error.response?.data;

    if (responseData?.code === "TOKEN_EXPIRED" && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token: unknown) => {
            originalRequest.headers.Authorization = `Bearer ${token as string}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refreshAccessToken(false);
        isRefreshing = false;
        failedQueue.forEach((prom) => prom.resolve(res?.accessToken ?? ""));
        failedQueue = [];

        if (setAccessToken !== null) {
          setAccessToken(res?.accessToken ?? "");
        }

        originalRequest.headers.Authorization = `Bearer ${res?.accessToken ?? ""}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        failedQueue.forEach((prom) => prom.reject(refreshError));
        failedQueue = [];
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
