import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private router: Router, private tokenService: TokenService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const session = this.tokenService.getSession();

    if (!session || !this.isTokenValid(session.accessToken)) {
      console.warn('Invalid or tampered token. Redirecting to login.');
      this.tokenService.clearTokens();
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }

    return true;
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp && payload.exp > now;
    } catch (e) {
      return false; 
    }
  }
}
