import { AuthService } from '@auth/auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentToken = this.authService.getToken();

    const jsonRequest = req.clone({
      setHeaders: {
        ContentType: 'application/json',
        Accept: 'application/json'
      }
    });

    if (currentToken && currentToken.access_token) {
      const requestWithToken = jsonRequest.clone({
        setHeaders: { Authorization: `Bearer ${currentToken.access_token}` }
      });

      return next.handle(requestWithToken);
    }

    return next.handle(jsonRequest);
  }
}
