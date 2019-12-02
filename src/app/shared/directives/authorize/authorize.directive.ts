import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';

import { PolicyFactory } from '@shared/factories/policy.factory';

@Directive({
  selector: '[appAuthorize]'
})
export class AuthorizeDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private policyFactory: PolicyFactory
  ) { }

  /**
   * @param policyData - кортеж ['объект, к которому проверяется доступ', 'имя метода, проверяющего доступ']
   */
  @Input() set appAuthorize(policyData: [any, string]) {
    const policy = this.policyFactory.getPolicyBy(policyData[0]);

    this.viewContainerRef.clear();
    if (policy.authorize(policyData[0], policyData[1])) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
