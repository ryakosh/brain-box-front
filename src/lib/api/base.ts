import axios, { type AxiosError, type AxiosInstance } from "axios";

import { APIError } from "./errors";
import { onlineManager } from "@tanstack/react-query";

function isNetworkError(error: any): boolean {
  // Axios-specific network error codes
  if (error.code) {
    return [
      "ECONNABORTED", // Timeout
      "ERR_NETWORK",
      "ERR_CONNECTION_REFUSED",
    ].includes(error.code);
  }

  if (error.response?.status) {
    return [
      500, // Internal Server Error
      502, // Bad Gateway
      503, // Service Unavailable
      504, // Gateway Timeout
    ].includes(error.response.status);
  }

  return false;
}

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
      onlineManager.setOnline(true);
      return resp;
    },
    (error: AxiosError) => {
      if (isNetworkError(error)) {
        onlineManager.setOnline(false);
      }

      if (error.response) {
        throw APIError.fromAxios(error);
      }

      // Network or other non-response error
      return Promise.reject(error);
    },
  );

  return instance;
};

export const api = createAxios(
  import.meta.env.VITE_API_BASE_URL || "http://192.168.1.24:8000",
);
export default api;
