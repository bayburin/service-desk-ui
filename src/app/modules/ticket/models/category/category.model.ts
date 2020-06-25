import { TicketI } from '@interfaces/ticket.interface';
import { ServiceI } from '@interfaces/service.interface';
import { CommonServiceI } from '@interfaces/common-service.interface';
import { Service } from '@modules/ticket/models/service/service.model';
import { Ticket, TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';

export class Category implements CommonServiceI {
  id: number;
  name: string;
  shortDescription: string;
  popularity: number;
  iconName: string;
  services: Service[];
  tickets: Ticket[];

  constructor(category: any = {}) {
    this.id = category.id || null;
    this.name = category.name || '';
    this.shortDescription = category.short_description || '';
    this.popularity = category.popularity || 0;
    this.iconName = category.icon_name;
    this.buildServices(category.services);
    this.buildFaq(category.faq);
  }

  getShowLink(): string {
    return `/categories/${this.id}`;
  }

  pageComponent(): string {
    return 'app-category-page-content';
  }

  private buildServices(services: ServiceI[]): void {
    if (!services || !services.length) {
      this.services = [];

      return;
    }

    this.services = services.map(service => ServiceFactory.create(service)) || [];
  }

  private buildFaq(tickets: TicketI[]) {
    if (!tickets || !tickets.length) {
      this.tickets = [];

      return;
    }

    this.tickets = tickets.map(ticket => TicketFactory.create(TicketTypes.QUESTION, ticket)) || [];
  }
}
