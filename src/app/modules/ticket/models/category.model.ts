import { CommonServiceI } from '@interfaces/common-service.interface';
import { Service } from './service.model';
import { Ticket } from './ticket/ticket.model';

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
    this.services = category.services || [];
    this.tickets = category.faq || [];
  }

  getShowLink(): string {
    return `/categories/${this.id}`;
  }

  pageComponent(): string {
    return 'CategoryPageContentComponent';
  }
}
