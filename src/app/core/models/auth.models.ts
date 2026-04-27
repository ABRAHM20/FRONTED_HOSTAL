export interface LoginRequest {
  email: string;
  password: string;
}

export interface RoleSimple {
  id: number;
  name: string;
  description?: string | null;
}

export interface UserDetail {
  id: number;
  name?: string;
  email: string;
  full_name?: string;
  roles?: RoleSimple[];
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
