import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap, delay, materialize, dematerialize } from 'rxjs/operators';
import { TokenI } from '@models/token.interface';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const testToken: TokenI = {
      type: 'Bearer',
      access_token: 'fake-jwt-token',
      refresh_token: 'fake-refresh-token'
    };

    if (req.url.endsWith('oauth/token') && req.method === 'POST') {
      return of(null).pipe(mergeMap(() => {
        return of(new HttpResponse({ body: testToken, status: 200 }));

      }))
      .pipe(materialize())
      .pipe(delay(3000))
      .pipe(dematerialize());
    }

    return next.handle(req);
  }
}
