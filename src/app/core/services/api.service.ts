// import { inject, Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { finalize, Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {
//   private apiUrl = environment.api;

//   constructor(private http: HttpClient) {}

//   get<T>(path: string, options?: { params?: HttpParams }): Observable<T> {
//     // this.loaderService.show();
//     return this.http.get<T>(`${this.apiUrl}/${path}`, options);
//   }  

//   post<T>(path: string, body: any): Observable<T> {
//     // this.loaderService.show()
//     return this.http.post<T>(`${this.apiUrl}/${path}`, body);
//   }

//   patch<T>(path: string, body: any): Observable<T> {
//     // this.loaderService.show();
//     return this.http.patch<T>(`${this.apiUrl}/${path}`, body);
//   }
//   put<T>(path: string, body: any): Observable<T> {
//     // this.loaderService.show();
//     return this.http.put<T>(`${this.apiUrl}/${path}`, body);
//   }

//   delete<T>(path: string): Observable<T> {
//     // this.loaderService.show();
//     return this.http.delete<T>(`${this.apiUrl}/${path}`);
//   }
// }