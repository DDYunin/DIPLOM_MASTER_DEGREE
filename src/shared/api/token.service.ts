const ACCESS_TOKEN_KEY = 'app_access_token'
const REFRESH_TOKEN_KEY = 'app_refresh_token'

export const tokenService = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),

  setTokens: (accessToken: string, refreshToken?: string) => {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    }
  },

  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}
