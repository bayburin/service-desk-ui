import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { TokenI } from '@models/token.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedFlag: boolean = localStorage.getItem('currentToken') ? true : false;
  private isLoggedInSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.loggedFlag);
  public readonly isUserSignedIn: Observable<boolean> = this.isLoggedInSub.asObservable();

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<void> {
    const body = {
      grant_type: 'password',
      username: username,
      password: password
    };

    return this.http.post('http://inv-dev/oauth/token', body)
      .pipe(map((token: TokenI) => {
        if (token && token.access_token) {
          localStorage.setItem('currentToken', JSON.stringify(token));
          this.isLoggedInSub.next(true);
        }
      }));
  }

  logout(): Observable<boolean> {
    const body = {
      token: JSON.parse(localStorage.getItem('currentToken')).access_token
    };

    return this.http.post('http://inv-dev/oauth/revoke', body)
      .pipe(map(() => this.unauthorize()));
  }

  unauthorize(): boolean {
    localStorage.removeItem('currentToken');
    this.isLoggedInSub.next(false);

    return true;
  }
}
