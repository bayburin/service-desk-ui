import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { APP_CONFIG } from '@config/app.config';
import { AppConfigI } from '@models/app-config.interface';
import { TokenI } from '@models/token.interface';
import { UserService } from '@shared/services/user/user.service';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = `${environment.serverUrl}/oauth/token`;
  private logoutUrl = `${environment.serverUrl}/oauth/revoke`;
  private loggedFlag = this.getToken() ? true : false;
  private isLoggedInSub = new BehaviorSubject<boolean>(this.loggedFlag);
  public readonly isUserSignedIn = this.isLoggedInSub.asObservable();

  constructor(
    private http: HttpClient,
    private userService: UserService,
    @Inject(APP_CONFIG) private config: AppConfigI
  ) { }

  login(username: string, password: string): Observable<void> {
    const body = {
      grant_type: 'password',
      username: username,
      password: password
    };

    return this.http.post(this.loginUrl, body)
      .pipe(map((token: TokenI) => {
        if (token && token.access_token) {
          this.setToken(token);
          this.isLoggedInSub.next(true);
        }
      }));
  }

  logout(): Observable<any> {
    const body = {
      token: this.getToken().access_token
    };

    return this.http.post(this.logoutUrl, body)
      .pipe(map(() => this.unauthorize()));
  }

  unauthorize(): void {
    this.removeToken();
    this.userService.clearUser();
    this.isLoggedInSub.next(false);

    location.reload();
  }

  getToken(): TokenI {
    return JSON.parse(localStorage.getItem(this.config.currentTokenStorage));
  }

  private setToken(token: TokenI): void {
    localStorage.setItem(this.config.currentTokenStorage, JSON.stringify(token));
  }

  private removeToken(): void {
    localStorage.removeItem(this.config.currentTokenStorage);
  }
}
