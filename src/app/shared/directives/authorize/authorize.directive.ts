import { Directive, TemplateRef, ViewContainerRef, Input, Injector } from '@angular/core';

import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { TicketPolicy } from '@shared/policies/ticket/ticket.policy';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServicePolicy } from '@shared/policies/service/service.policy';

@Directive({
  selector: '[appAuthorize]'
})
export class AuthorizeDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector
  ) { }

  /**
   * @param policyData - кортеж ['объект, к которому проверяется доступ', 'имя метода, проверяющего доступ']
   */
  @Input() set appAuthorize(policyData: [any, string]) {
    const policy = this.getPolicy(policyData[0]);

    if (policy.authorize(policyData[0], policyData[1])) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }

  private getPolicy(object: any) {
    if (object instanceof Ticket) {
      return this.injector.get(TicketPolicy);
    } else if (object instanceof Service) {
      return this.injector.get(ServicePolicy);
    } else {
      throw new Error('Unknown policy type');
    }
  }
}
