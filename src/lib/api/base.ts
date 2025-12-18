import axios, {
  type InternalAxiosRequestConfig,
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";

import { APIError } from "@/lib/api/errors";
import { authManager } from "@/lib/auth/base";
import { TokenRefreshError } from "../auth/errors";

const createAxios = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 15_000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = authManager.getToken();

      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (resp: AxiosResponse) => {
      return resp;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newToken = await authManager.refreshToken();

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return api(originalRequest);
        } catch (error: unknown) {
          if (error instanceof TokenRefreshError) {
            window.location.href = "/auth/login";
          }

          return Promise.reject(error);
        }
      }

      if (error.response) {
        return Promise.reject(APIError.fromAxios(error));
      }

      // Network or other non-response error
      return Promise.reject(error);
    },
  );

  return instance;
};

export const api = createAxios("/api");
export default api;
