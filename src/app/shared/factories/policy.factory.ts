import { Injectable, Injector } from '@angular/core';

import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { TicketPolicy } from '@shared/policies/ticket/ticket.policy';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServicePolicy } from '@shared/policies/service/service.policy';

@Injectable({
  providedIn: 'root'
})
export class PolicyFactory {
  constructor(private injector: Injector) {}

  getPolicyBy(object: any) {
    if (object instanceof Ticket) {
      return this.injector.get(TicketPolicy);
    } else if (object instanceof Service) {
      return this.injector.get(ServicePolicy);
    } else {
      throw new Error('Unknown policy type');
    }
  }
}
