import { CommonServiceI } from '@interfaces/common-service.interface';
import { Service } from './service.model';
import { Ticket } from './ticket/ticket.model';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';

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

    if (category.services) {
      this.services = category.services.map((service) => ServiceFactory.create(service)) || [];
    }

    if (category.faq) {
      this.tickets = category.faq.map((ticket) => TicketFactory.create(ticket)) || [];
    }
  }

  getShowLink(): string {
    return `/categories/${this.id}`;
  }

  pageComponent(): string {
    return 'app-category-page-content';
  }
}
