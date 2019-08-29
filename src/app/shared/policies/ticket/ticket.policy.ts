import { Injectable } from '@angular/core';

import { ApplicationPolicy } from '@shared/policies/application/application.policy';

@Injectable({
  providedIn: 'root'
})
export class TicketPolicy extends ApplicationPolicy {}
