import { Injectable } from '@angular/core';

import { User } from 'app/core/models/user/user.model';
import { UserService } from '@shared/services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationPolicy {
  user: User;
  object: any;

  constructor(private userService: UserService) {
    this.userService.user.subscribe(user => this.user = user);
  }

  authorize(object: any, method: any): boolean {
    this.object = object;

    return this[method]();
  }
}

