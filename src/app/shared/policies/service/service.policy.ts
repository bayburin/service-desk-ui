import { Injectable } from '@angular/core';

import { ApplicationPolicy } from '@shared/policies/application/application.policy';

@Injectable({
  providedIn: 'root'
})
export class ServicePolicy extends ApplicationPolicy {
  newTicket(): boolean {
    if (this.user.hasRole('service_responsible')) {
      return this.object.isBelongsTo(this.user) || this.object.isBelongsByTicketTo(this.user);
    } else {
      return this.user.hasRole('content_manager');
    }
  }
}
