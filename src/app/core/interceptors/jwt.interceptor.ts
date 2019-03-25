import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentToken = JSON.parse(localStorage.getItem('currentToken'));

    if (currentToken && currentToken.access_token) {
      const reqWithToken = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken.access_token}`
        }
      });

      return next.handle(reqWithToken);
    }

    return next.handle(req);
  }
}
