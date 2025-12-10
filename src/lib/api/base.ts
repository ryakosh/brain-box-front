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
    (resp) => {
      return resp;
    },
    (error: AxiosError) => {
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
