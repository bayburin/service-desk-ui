import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserI } from '@models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: UserI = JSON.parse(localStorage.getItem('currentUser'));

  constructor(private http: HttpClient) {}

  loadData(): Observable<UserI> {
    return this.http.get('http://inv-dev/api/v1/users/info').pipe(
      map((data: UserI) => this.user = data)
    );
  }

  getUser(): UserI {
    return this.user;
  }

  setUser(data: UserI) {
    localStorage.setItem('currentUser', JSON.stringify(data));
  }
}
