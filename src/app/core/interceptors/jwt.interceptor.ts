import { AuthService } from '@auth/auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentToken = this.authService.getToken();
    req = this.interceptJSONRequest(req);

    if (currentToken && currentToken.access_token) {
      const requestWithToken = req.clone({
        setHeaders: { Authorization: `Bearer ${currentToken.access_token}` }
      });

      return next.handle(requestWithToken);
    }

    return next.handle(req);
  }

  private interceptJSONRequest(req: HttpRequest<any>): HttpRequest<any> {
    if (req.headers.has('InterceptorSkipJSONHeaders')) {
      const headers = req.headers.delete('InterceptorSkipJSONHeaders');

      return req.clone({ headers });
    } else {
      return req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });
    }
  }
}
