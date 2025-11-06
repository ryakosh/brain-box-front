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
    const data: any = err.response?.data;
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

export function isRetryableNetworkError(error: unknown): boolean {
  // 1. Is it our custom APIError?
  if (error instanceof APIError) {
    // APIError means we got a response.
    // Only retry 5xx server-down errors.
    return error.status >= 500 && error.status <= 504;
  }

  // 2. Is it an AxiosError?
  if (error && (error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError;

    // 3. No response means a true network failure
    // (e.g., ERR_NETWORK, ERR_CONNECTION_REFUSED, timeout)
    if (!axiosError.response) {
      return true;
    }

    // 4. We got a response, but it's a 5xx (server down)
    const statusCode = axiosError.response.status;
    return statusCode >= 500 && statusCode <= 504;
  }

  // 5. Is it a generic Error (e.g., fetch failed)?
  // This is a fallback.
  if (
    error instanceof Error &&
    error.message.toLowerCase().includes("network")
  ) {
    return true;
  }

  // Not a network error, don't retry.
  return false;
}
