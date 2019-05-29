import { AuthService } from '@auth/auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentToken = this.authService.getToken();

    if (currentToken && currentToken.access_token) {
      const reqWithToken = req.clone({
        setHeaders: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken.access_token}`
        }
      });

      return next.handle(reqWithToken);
    }

    return next.handle(req);
  }
}
