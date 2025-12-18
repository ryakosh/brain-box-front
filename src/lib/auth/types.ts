export type LoginForm = {
  username: string;
  password: string;
};

export interface TokenRead {
  token: string;
  token_type: string;
  expires_in: number;
}
