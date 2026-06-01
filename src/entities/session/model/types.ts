export interface LoginCredentials {
  login: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken?: string
}
