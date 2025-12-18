export class AuthError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "AuthError";
  }
}

export class LoginError extends AuthError {
  constructor(message = "Invalid username or password.") {
    super(message);

    this.name = "LoginError";
  }
}

export class TokenRefreshError extends AuthError {
  constructor(message = "Session expired. Please log in again.") {
    super(message);

    this.name = "TokenRefreshError";
  }
}
