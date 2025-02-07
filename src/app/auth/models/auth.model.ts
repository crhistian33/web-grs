export interface LoginResponse {
  access_token: string,
  refresh_token: string,
}

export interface AuthResponse {
  success: boolean,
  data?: LoginResponse,
  error?: string,
}
