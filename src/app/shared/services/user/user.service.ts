import { Injectable } from '@angular/core';

import { UserI } from '@models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: UserI = JSON.parse(localStorage.getItem('currentUser'));

  constructor() {}

  getUser(): UserI {
    return this.user;
  }

  setUser(data: UserI) {
    localStorage.setItem('currentUser', JSON.stringify(data));
  }
}
