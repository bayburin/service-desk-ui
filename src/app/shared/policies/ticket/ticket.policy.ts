import { Injectable } from '@angular/core';

import { ApplicationPolicy } from '@shared/policies/application/application.policy';

@Injectable({
  providedIn: 'root'
})
export class TicketPolicy extends ApplicationPolicy {
  showFlags(): boolean {
    if (this.user.hasRole('service_responsible')) {
      return this.object.isBelongsTo(this.user) || this.object.isBelongsByServiceTo(this.user);
    } else {
      return this.user.hasRole('content_manager') || this.user.hasRole('operator');
    }
  }

  publish(): boolean {
    return this.user.hasRole('content_manager') && (this.object.isDraftState() || this.object.correction);
  }

  destroy(): boolean {
    return this.user.hasRole('content_manager');
  }
}
