import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private router: Router) {}

    /**
   * Intercepts HTTP requests to add an Authorization header if a token is present in localStorage.
   * It also handles HTTP errors, such as unauthorized (401) and forbidden (403) responses.
   * 
   * @param {HttpRequest<any>} req - The outgoing HTTP request.
   * @param {HttpHandler} next - The next handler in the HTTP request chain.
   * @returns {Observable<HttpEvent<any>>} - The observable stream containing the HTTP response or an error.
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('token');
    if (authToken && !req.url.endsWith('/register/')) {
      req = req.clone({
        setHeaders: {
          Authorization: `Token ${authToken}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            console.error('Unauthorized request:', err);
            this.router.navigateByUrl('/login');
          } else if (err.status === 403) {
            console.error('Forbidden request:', err);
          }
        }
        return throwError(() => err);
      })
    );
  }
}
