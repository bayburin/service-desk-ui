import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { APP_CONFIG } from '@config/app.config';
import { UserI } from '@interfaces/user.interface';
import { AppConfigI } from '@interfaces/app-config.interface';
import { environment } from 'environments/environment';
import { UserOwnsI } from '@interfaces/user-owns.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loadUserInfoUrl = `${environment.serverUrl}/api/v1/users/info`;
  private loadUserOwnsUrl = `${environment.serverUrl}/api/v1/users/owns`;
  private currentUser: UserI = JSON.parse(localStorage.getItem(this.config.currentUserStorage)) || null;
  private userSubj = new BehaviorSubject<UserI>(this.currentUser);
  user = this.userSubj.asObservable();

  constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfigI) {}

  /**
   * Получить данные о пользователе.
   */
  loadUserInfo(): Observable<UserI> {
    return this.http.get(this.loadUserInfoUrl).pipe(tap((data: UserI) => this.setUser(data)));
  }

  /**
   * Получить списки объектов, с которыми может работать пользователь для создания заявок (список техники, список сервисов и т.п.).
   */
  loadUserOwns(): Observable<UserOwnsI> {
    return this.http.get<UserOwnsI>(this.loadUserOwnsUrl).pipe(
      map((data) => {
        data.services = data.services.map(service => ServiceFactory.create(service));

        return data;
      })
    );
  }

  /**
   * Записать данные о пользователе в localStorage.
   */
  setUser(data: UserI): void {
    localStorage.setItem(this.config.currentUserStorage, JSON.stringify(data));
    this.userSubj.next(data);
  }

  /**
   * Удалить данные о пользователе из localStorage.
   */
  clearUser(): void {
    localStorage.removeItem(this.config.currentUserStorage);
  }
}
