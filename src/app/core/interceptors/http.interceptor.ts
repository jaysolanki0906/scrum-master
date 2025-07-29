import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { catchError, finalize, switchMap, throwError, from } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';
import { Router } from '@angular/router';
import { LoaderService } from '../services/loader.service'; 

export const httpInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next) => {
  const supabase = inject(SupabaseService).client;
  const router = inject(Router);
  const loaderService = inject(LoaderService);

  loaderService.show();

  return from(supabase.auth.getSession()).pipe(
    switchMap(({ data }) => {
      const token = data?.session?.access_token;

      if (!token) {
        router.navigate(['/login']);
        return throwError(() => new Error('No access token'));
      }

      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            supabase.auth.signOut();
            router.navigate(['/login']);
          }
          return throwError(() => error);
        }),
        finalize(() => loaderService.hide())
      );
    }),
    catchError((err) => {
      router.navigate(['/login']);
      return throwError(() => err);
    }),
    finalize(() => loaderService.hide())
  );
};
