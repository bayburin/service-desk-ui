import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { APP_CONFIG } from '@config/app.config';
import { UserI } from '@models/user.interface';
import { AppConfigI } from '@models/app-config.interface';
import { environment } from 'environments/environment';
import { UserOwnsI } from '@models/user-owns.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loadUserInfoUrl = `${environment.serverUrl}/api/v1/users/info`;
  private loadUserOwnsUrl = `${environment.serverUrl}/api/v1/users/owns`;
  private currentUser: UserI = JSON.parse(localStorage.getItem(this.config.currentUserStorage)) || null;
  private userSubj = new BehaviorSubject<UserI>(this.currentUser);
  public user = this.userSubj.asObservable();

  constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfigI) {}

  loadUserInfo(): Observable<UserI> {
    return this.http.get(this.loadUserInfoUrl).pipe(map((data: UserI) => {
      this.setUser(data);

      return data;
    }));
  }

  loadUserOwns(): Observable<UserOwnsI> {
    return this.http.get<UserOwnsI>(this.loadUserOwnsUrl);
  }

  setUser(data: UserI): void {
    localStorage.setItem(this.config.currentUserStorage, JSON.stringify(data));
    this.userSubj.next(data);
  }

  clearUser(): void {
    localStorage.removeItem(this.config.currentUserStorage);
  }
}
