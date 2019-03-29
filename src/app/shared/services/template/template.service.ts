import { Injectable } from '@angular/core';
import { ServiceTemplateI } from '@models/service-template.interface';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  constructor() {}

  generateUrlBy(template: ServiceTemplateI): string {
    if (template.service_id) {
      return `/services/${template.service_id}/tickets/${template.id}`;
    } else if (template.category_id) {
      return `/categories/${template.category_id}/services`;
    } else {
      return `/categories/${template.id}`;
    }
  }
}
