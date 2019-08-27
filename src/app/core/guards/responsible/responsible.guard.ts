import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { UserService } from '@shared/services/user/user.service';
import { User } from 'app/core/models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class ResponsibleGuard implements CanLoad {
  constructor(private userService: UserService) {}

  canLoad(): Observable<boolean> {
    return this.userService.user
      .pipe(
        map((user: User) => user.hasOneOfRoles(['operator', 'content_manager', 'service_responsible'])),
        take(1)
      );
  }
}
