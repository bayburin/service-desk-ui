import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { APP_CONFIG } from '@config/app.config';
import { AppConfigI } from '@interfaces/app-config.interface';
import { TokenI } from '@interfaces/token.interface';
import { UserService } from '@shared/services/user/user.service';
import { environment } from 'environments/environment';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessTokenUri = `${environment.serverUrl}/api/v1/auth/token`;
  private loggedFlag = this.getToken() ? true : false;
  isLoggedInSub = new BehaviorSubject<boolean>(this.loggedFlag);
  readonly isUserSignedIn = this.isLoggedInSub.asObservable();

  constructor(
    private http: HttpClient,
    private userService: UserService,
    @Inject(APP_CONFIG) private config: AppConfigI,
    private activatedRoute: ActivatedRoute,
  ) { }

  /**
   * Авторизовывает приложение.
   */
  authorize() {
    const state = this.generateState(30);
    const authCenterUri = 'https://auth-center.iss-reshetnev.ru/oauth/authorize';
    const queryParams = `?client_id=${environment.clientId}&response_type=code&state=${state}&redirect_uri=${environment.authorizeUri}&scope=`;
    const authorizeUri = authCenterUri + queryParams;

    this.setState(state);
    window.open(authorizeUri, '_self');
  }

  /**
   * Запрашивает и возвращает AccessToken у серверва.
   */
  getAccessToken(): Observable<void> {
    const params = this.activatedRoute.snapshot.queryParams;
    const body = {
      code: params.code,
      state: params.state
    };

    return this.http.post(this.accessTokenUri, body)
      .pipe(map((token: TokenI) => {
        this.removeState();

        if (token && token.access_token) {
          this.setToken(token);
        }
      }));
  }

  /**
   * Выходит из приложения.
   */
  unauthorize(): Observable<any> {
    const uri = `${environment.serverUrl}/api/v1/auth/revoke`;

    return this.http.post(uri, {}).pipe(tap(() => this.clearAuthData()));
  }

  /**
   * Очищает данные авторизации.
   */
  clearAuthData(): void {
    this.removeToken();
    this.userService.clearUser();
    this.isLoggedInSub.next(false);
  }

  /**
   * Возвращает текущий AccessToken.
   */
  getToken(): TokenI {
    return JSON.parse(localStorage.getItem(this.config.currentTokenStorage));
  }

  /**
   * Сохраняет URL, на который будет происходить переход после авторизации приложения.
   */
  setReturnUrl(url: string): void {
    localStorage.setItem(this.config.redirectAfterAuthorizeUrlName, url);
  }

  /**
   * Возвращает URL, на который будет происходить переход после авторизации приложения.
   */
  getReturnUrl(): string {
    return localStorage.getItem(this.config.redirectAfterAuthorizeUrlName) || '';
  }

  /**
   * Проверка валидности параметра state для авторизации приложения.
   */
  isValidState(state: string): boolean {
    return state === this.getState();
  }

  private setToken(token: TokenI): void {
    localStorage.setItem(this.config.currentTokenStorage, JSON.stringify(token));
  }

  private removeToken(): void {
    localStorage.removeItem(this.config.currentTokenStorage);
  }

  private generateState(length): string {
    let result = '';
    const dictionary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      result += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
    }

    return result;
  }

  private setState(state: string): void {
    localStorage.setItem(this.config.authState, state);
  }

  private getState(): string {
   return localStorage.getItem(this.config.authState);
  }

  private removeState(): void {
    localStorage.removeItem(this.config.authState);
  }
}
