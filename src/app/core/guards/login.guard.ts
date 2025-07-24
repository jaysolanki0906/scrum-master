import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class loginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      this.router.navigate(['dashboard'], { replaceUrl: true });
      return false; 
    }
    return true; 
  }
}