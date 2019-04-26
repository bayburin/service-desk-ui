import { ServiceTemplateI } from './service-template.interface';

export interface CommonServiceI {
  getShowLink(template: ServiceTemplateI): string;
}
