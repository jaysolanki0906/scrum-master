import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private router: Router,private sharedService:SharedService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userId = this.sharedService.getUserId();
    const userRole = this.sharedService.getUserRole();
    if (accessToken && refreshToken) {
      return true;
    } else {
      this.router.navigate(['login'],{ replaceUrl: false });
      return false;
    }
  }
}