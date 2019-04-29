import { ServiceTemplateI } from '@interfaces/service-template.interface';
import { Category } from '@modules/ticket/models/category.model';
import { Service } from '@modules/ticket/models/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

/**
 * Фабричный метод для создания экземпляров класса Category, Service, Ticket
 */
export class ServiceTemplateCreator {
  static createBy(template: ServiceTemplateI) {
    if (template.service_id) {
      return new Ticket(template);
    } else if (template.category_id) {
      return new Service(template);
    } else {
      return new Category(template);
    }
  }
}
