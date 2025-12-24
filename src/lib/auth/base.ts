import axios from "axios";

import type { LoginForm, TokenRead } from "@/lib/auth/types";
import { LoginError, TokenRefreshError } from "@/lib/auth/errors";

const authAPI = axios.create({
  baseURL: "/api/auth",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  },
  withCredentials: true,
});

class AuthManager {
  /**
   * The current access token.
   */
  private token: string | null = null;

  /**
   * A promise singleton used to lock the refresh process.
   * If not null, a refresh is currently in progress.
   */
  private refreshPromise: Promise<string> | null = null;

  /**
   * Retrieves the current valid access token.
   *
   * @returns {string | null} The access token string, or null if not authenticated.
   */
  public getToken(): string | null {
    return this.token;
  }

  /**
   * Authenticates the user with the backend.
   *
   * @param {LoginForm} loginForm - The username and password.
   * @returns {Promise<string>} The new access token.
   * @throws {LoginError} If credentials are invalid or the server rejects the login.
   */
  public async login(loginForm: LoginForm): Promise<string> {
    const payload = new URLSearchParams(loginForm);

    try {
      const { data } = await authAPI.post<TokenRead>(`/login`, payload);

      this.token = data.token;

      return this.token;
    } catch (_: unknown) {
      throw new LoginError();
    }
  }

  /**
   * Logs the user out.
   */
  public async logout(): Promise<void> {
    await authAPI.post("/logout");

    this.token = null;
    this.refreshPromise = null;
  }

  /**
   * Refreshes the access token.
   *
   * @returns {Promise<string>} The new access token.
   * @throws {TokenRefreshError} If the refresh cookie is missing, expired, or invalid.
   */
  public async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const { data } = await authAPI.post<TokenRead>(`/token`);
        const newToken = data.token;

        this.token = newToken;

        return newToken;
      } catch (_: unknown) {
        this.logout();

        throw new TokenRefreshError();
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }
}

export const authManager = new AuthManager();
