import { ServiceTemplateI } from '@interfaces/service-template.interface';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';

/**
 * Фабричный метод для создания экземпляров класса Category, Service, Ticket
 */
export class ServiceTemplateCreator {
  static createBy(template: ServiceTemplateI) {
    if (template.ticket) {
      return TicketFactory.create(template.ticket.ticketable_type, template);
    } else if (template.category_id) {
      return ServiceFactory.create(template);
    } else {
      return CategoryFactory.create(template);
    }
  }
}
