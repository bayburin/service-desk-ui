import { ServiceTemplateI } from './service-template.interface';

export interface CommonServiceI {
  getListLink(template: ServiceTemplateI): string;
}
