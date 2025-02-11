import { User } from "@models/user.model";

export interface LoginResponse {
  access_token: string,
  refresh_token: string,
  user: User,
}

export interface AuthResponse {
  success: boolean,
  data?: LoginResponse,
  error?: string,
}
