import { Category } from './category.model';
import { Ticket } from './ticket/ticket.model';
import { CommonServiceI } from '@interfaces/common-service.interface';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';

export class Service implements CommonServiceI {
  id: number;
  categoryId: number;
  name: string;
  shortDescription: string;
  install: string;
  isSla: boolean;
  sla: string;
  popularity: number;
  questionLimit: number;
  category: Category;
  tickets: Ticket[];

  constructor(service: any = {}) {
    this.id = service.id || null;
    this.categoryId = service.category_id || null;
    this.name = service.name || '';
    this.shortDescription = service.short_description || '';
    this.install = service.install || '';
    this.isSla = service.is_sla || false;
    this.sla = service.sla || 0;
    this.popularity = service.popularity || 0;

    if (service.tickets) {
      this.tickets = service.tickets.map(ticket => TicketFactory.create(ticket)) || [];
    }

    if (service.category) {
      this.category = CategoryFactory.create(service.category) || null;
    }
  }

  getShowLink(): string {
    return `/categories/${this.categoryId}/services/${this.id}`;
  }

  pageComponent(): string {
    return 'app-service-page-content';
  }
}
