import axios, { type AxiosError, type AxiosInstance } from "axios";

import { APIError } from "./errors";

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
    (resp) => resp,
    (error: AxiosError) => {
      if (error.response) {
        throw APIError.fromAxios(error);
      }

      // Network or other non-response error
      throw new APIError({
        message: error.message || "Network error",
        status: 0,
        original: error,
      });
    },
  );

  return instance;
};

export const api = createAxios(
  import.meta.env.VITE_API_BASE_URL || "https://192.168.1.24:8000",
);
export default api;
