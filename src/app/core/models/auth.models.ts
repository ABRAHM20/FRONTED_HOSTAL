export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserDetail {
  id: number;
  email: string;
  full_name?: string;
  permissions?: string[];
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserLoginResponse extends TokenResponse {
  user: UserDetail;
}
