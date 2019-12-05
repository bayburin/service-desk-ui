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
import { User } from '@shared/models/user/user.model';
import { UserFactory } from '@shared/factories/user.factory';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loadUserInfoUri = `${environment.serverUrl}/api/v1/users/info`;
  private loadUserOwnsUri = `${environment.serverUrl}/api/v1/users/owns`;
  private currentUser: User = UserFactory.create(JSON.parse(localStorage.getItem(this.config.currentUserStorage))) || null;
  private userSubj = new BehaviorSubject<User>(this.currentUser);
  user = this.userSubj.asObservable();

  constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfigI) {}

  /**
   * Получить данные о пользователе.
   */
  loadUserInfo(): Observable<User> {
    return this.http.get(this.loadUserInfoUri)
      .pipe(
        map((data: UserI) => UserFactory.create(data)),
        tap((user: User) => this.setUser(user))
      );
  }

  /**
   * Получить списки объектов, с которыми может работать пользователь для создания заявок (список техники, список сервисов и т.п.).
   */
  loadUserOwns(): Observable<UserOwnsI> {
    return this.http.get<UserOwnsI>(this.loadUserOwnsUri).pipe(
      map((data) => {
        data.services = data.services.map(service => ServiceFactory.create(service));

        return data;
      })
    );
  }

  /**
   * Записать данные о пользователе в localStorage.
   */
  setUser(user: User): void {
    localStorage.setItem(this.config.currentUserStorage, JSON.stringify(user));
    this.userSubj.next(user);
  }

  /**
   * Удалить данные о пользователе из localStorage.
   */
  clearUser(): void {
    localStorage.removeItem(this.config.currentUserStorage);
  }
}
