import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { APP_CONFIG } from '@config/app.config';
import { UserI } from '@models/user.interface';
import { AppConfigI } from '@models/app-config.interface';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loadDataUrl = `${environment.serverUrl}/api/v1/users/info`;
  private user: UserI = JSON.parse(localStorage.getItem(this.config.currentUserStorage));

  constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfigI) {}

  loadData(): Observable<UserI> {
    return this.http.get(this.loadDataUrl).pipe(map((data: UserI) => {
      this.setUser(data);

      return this.user;
    }));
  }

  getUser(): UserI {
    return this.user;
  }

  setUser(data: UserI): void {
    localStorage.setItem(this.config.currentUserStorage, JSON.stringify(data));
    this.user = data;
  }

  clearUser(): void {
    localStorage.removeItem(this.config.currentUserStorage);
  }
}
