import { Injectable, Injector } from '@angular/core';
import { CanLoad, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { UserService } from '@shared/services/user/user.service';
import { User } from '@shared/models/user/user.model';
import { ServicePolicy } from '@shared/policies/service/service.policy';
import { TicketPolicy } from '@shared/policies/ticket/ticket.policy';
import { ServiceService } from '@shared/services/service/service.service';

@Injectable({
  providedIn: 'root'
})
export class ResponsibleGuard implements CanLoad, CanActivate {
  constructor(
    private userService: UserService,
    private service: ServiceService,
    private injector: Injector
  ) {}

  canLoad(): Observable<boolean> {
    return this.userService.user
      .pipe(
        map((user: User) => user.hasOneOfRoles(['content_manager', 'service_responsible'])),
        take(1)
      );
  }

  canActivate(next: ActivatedRouteSnapshot): boolean {
    const policy = this.injector.get<ServicePolicy | TicketPolicy>(next.data.policy);
    const action = next.data.action;

    return policy.authorize(this.service.service, action);
  }
}
