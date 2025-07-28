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

export const httpInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: import('@angular/common/http').HttpHandlerFn) => {
  const supabase = inject(SupabaseService).client;
  const router = inject(Router);
  const loaderService = inject(LoaderService); 

  loaderService.show(); 

  return from(supabase.auth.getSession()).pipe(
    switchMap(({ data, error }) => {
      if (error || !data?.session?.access_token) {
        console.warn('No valid session found. Redirecting to login.');
        loaderService.hide(); 
        router.navigate(['/login']);
        return throwError(() => new Error('Session invalid'));
      }

      const token = data.session.access_token;
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.warn('Token expired or unauthorized. Logging out.');
            supabase.auth.signOut();
            router.navigate(['/login']);
          }
          return throwError(() => error);
        }),
        finalize(() => loaderService.hide()) 
      );
    }),
    catchError((err) => {
      loaderService.hide();
      return throwError(() => err);
    })
  );
};
