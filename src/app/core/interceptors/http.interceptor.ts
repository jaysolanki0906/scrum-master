import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);
 

  const accessToken = tokenService.getAccessToken();
  const clonedReq = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((res: any) => {
            tokenService.saveAcessToken(res.access_token);
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.access_token}` }
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            tokenService.clearTokens();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          }),
          finalize(() => { 
          })
        );
      }
      return throwError(() => error);
    }),
    finalize(() => {
    })
  );
};