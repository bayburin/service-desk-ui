import { Injectable, Injector } from '@angular/core';
import { ServiceTemplateI } from '@models/service-template.interface';

import { CategoryService } from '@shared/services/category/category.service';
import { ServiceService } from '@shared/services/service/service.service';
import { CommonServiceI } from '@models/common-service.interface';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  public currentTemplate: CommonServiceI;

  constructor(private injector: Injector) {}

  setCurrentState(template: ServiceTemplateI) {
    if (template.service_id) {
      // this.currentTemplate = this.injector.get(TicketService);
    } else if (template.category_id) {
      this.currentTemplate = this.injector.get(ServiceService);
    } else {
      this.currentTemplate = this.injector.get(CategoryService);
    }
  }

  generateUrlBy(template: ServiceTemplateI): string {
    this.setCurrentState(template);
    return this.currentTemplate.getListLink(template);
  }

  filterTemplateArr(arr: ServiceTemplateI[], type: string): ServiceTemplateI[] {
    return arr.filter((template: ServiceTemplateI) => {
      this.setCurrentState(template);
      return this.currentTemplate.constructor.name === `${type}Service`;
    });
  }


}
