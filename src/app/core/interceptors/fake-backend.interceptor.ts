import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, delay, materialize, dematerialize } from 'rxjs/operators';
import { TokenI } from '@interfaces/token.interface';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const testToken: TokenI = {
      type: 'Bearer',
      access_token: 'fake-jwt-token',
      refresh_token: 'fake-refresh-token'
    };
    const userInfo = {
      fio: 'Форточкина Клавдия Ивановна',
      tn: 100123,
      tel: '41-85',
      dept: 714,
      email: 'fortochkina'
    };

    // if (req.url.endsWith('auth/token') && req.method === 'POST') {
    //   // return of(new HttpResponse({ body: testToken, status: 200 }));
    //   return throwError({ error: { message: 'Unauthorized' } });
    // }

    // if (req.url.endsWith('users/info') && req.method === 'GET') {
    //   // return of(new HttpResponse({ body: userInfo, status: 200 }));
    //   return throwError({ error: { message: 'Unauthorized' } });
    // }

    return next.handle(req)
      .pipe(
        materialize(),
        delay(1500),
        dematerialize()
      );

    // return next.handle(req);
  }
}
