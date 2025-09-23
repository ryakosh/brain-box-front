import type { AxiosError } from "axios";

export class APIError extends Error {
  status: number;
  data?: any;
  original?: AxiosError | Error;

  constructor({
    message,
    status,
    data,
    original,
  }: { message: string; status: number; data?: any; original?: any }) {
    super(message);

    this.name = "APIError";
    this.status = status;
    this.data = data;
    this.original = original;
  }

  static fromAxios(err: AxiosError) {
    const status = err.response?.status ?? 0;
    const data = err.response?.data;
    const message =
      (data && (data.detail || data.message)) ||
      err.message ||
      `HTTP ${status}`;

    return new APIError({ message, status, data, original: err });
  }
}

export const extractValidationErrors = (
  payload: any,
): { [field: string]: string[] } => {
  // backend returns { detail: [{ loc: [...], msg, type }, ...] }
  const out: Record<string, string[]> = {};
  const detail = payload?.detail;

  if (!Array.isArray(detail)) return out;

  for (const it of detail) {
    const loc = Array.isArray(it.loc)
      ? it.loc.join(".")
      : String(it.loc ?? "unknown");
    out[loc] = out[loc] || [];
    out[loc].push(it.msg || "Invalid");
  }

  return out;
};
