import axios, { type AxiosError, type AxiosInstance } from "axios";
import { onlineManager } from "@tanstack/react-query";

import { APIError, isRetryableNetworkError } from "./errors";

const createAxios = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 15_000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  instance.interceptors.response.use(
    (resp) => {
      return resp;
    },
    (error: AxiosError) => {
      onlineManager.setOnline(!isRetryableNetworkError(error));

      if (error.response) {
        return Promise.reject(APIError.fromAxios(error));
      }

      // Network or other non-response error
      return Promise.reject(error);
    },
  );

  return instance;
};

export const api = createAxios(
  import.meta.env.VITE_API_BASE_URL || "https://192.168.1.24:8000",
);
export default api;
