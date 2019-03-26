import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { APP_CONFIG } from '@config/app.config';
import { AppConfigI } from '@models/app-config.interface';
import { TokenI } from '@models/token.interface';
import { UserService } from '@shared/services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedFlag: boolean = this.getToken() ? true : false;
  private isLoggedInSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.loggedFlag);
  public readonly isUserSignedIn: Observable<boolean> = this.isLoggedInSub.asObservable();

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

    return this.http.post('http://inv-dev/oauth/token', body)
      .pipe(map((token: TokenI) => {
        if (token && token.access_token) {
          this.setToken(token);
          this.isLoggedInSub.next(true);
        }
      }));
  }

  logout(): Observable<boolean> {
    const body = {
      token: this.getToken().access_token
    };

    return this.http.post('http://inv-dev/oauth/revoke', body)
      .pipe(map(() => this.unauthorize()));
  }

  unauthorize(): boolean {
    this.removeToken();
    this.userService.clearUser();
    this.isLoggedInSub.next(false);

    return true;
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
