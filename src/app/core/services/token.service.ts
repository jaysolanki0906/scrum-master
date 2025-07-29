import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private ACCESS_TOKEN_KEY = 'access_token';
  private REFRESH_TOKEN_KEY = 'refresh_token';

  saveTokens(access: string, refresh: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, access);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refresh);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
  saveAcessToken(access:string):void{
    localStorage.setItem(this.ACCESS_TOKEN_KEY,access);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
  getSession() {
  const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

  if (!accessToken) return null;

  const user = this.parseJwt(accessToken); 
  return { accessToken, refreshToken, user };
}

private parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

}