import { Injectable } from '@angular/core';

const ACCESS_TOKEN_KEY = 'hotel_access_token';
const REFRESH_TOKEN_KEY = 'hotel_refresh_token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  getAccessToken(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error accediendo a localStorage para access token:', error);
      return null;
    }
  }

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error accediendo a localStorage para refresh token:', error);
      return null;
    }
  }

  setTokens(accessToken: string, refreshToken: string): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('Error guardando tokens en localStorage:', error);
      // Si falla localStorage, al menos los tenemos en memoria
    }
  }

  clearTokens(): void {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error limpiando tokens de localStorage:', error);
    }
  }

  hasAccessToken(): boolean {
    try {
      return Boolean(this.getAccessToken());
    } catch (error) {
      console.error('Error verificando access token:', error);
      return false;
    }
  }
}
