import { Category } from '@modules/ticket/models/category/category.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { CommonServiceI } from '@interfaces/common-service.interface';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';
import { ResponsibleUserI } from '@interfaces/responsible_user.interface';

export class Service implements CommonServiceI {
  id: number;
  categoryId: number;
  name: string;
  shortDescription: string;
  install: string;
  isSla: boolean;
  popularity: number;
  questionLimit: number;
  category: Category;
  tickets: Ticket[];
  responsibleUsers: ResponsibleUserI[];

  constructor(service: any = {}) {
    this.id = service.id;
    this.categoryId = service.category_id;
    this.name = service.name;
    this.shortDescription = service.short_description;
    this.install = service.install;
    this.isSla = service.is_sla;
    this.popularity = service.popularity;
    this.responsibleUsers = service.responsible_users || [];

    if (service.tickets) {
      this.tickets = service.tickets.map(ticket => TicketFactory.create(ticket)) || [];
    }

    if (service.category) {
      this.category = CategoryFactory.create(service.category);
    }
  }

  getShowLink(): string {
    return `/categories/${this.categoryId}/services/${this.id}`;
  }

  pageComponent(): string {
    return 'app-service-page-content';
  }
}
