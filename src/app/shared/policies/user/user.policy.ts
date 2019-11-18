import { Injectable } from '@angular/core';

import { ApplicationPolicy } from '@shared/policies/application/application.policy';

@Injectable({
  providedIn: 'root'
})
export class UserPolicy extends ApplicationPolicy {
  responsibleUserAccess(): boolean {
    return this.user.hasOneOfRoles(['content_manager', 'operator', 'service_responsible']);
  }
}
