import { Category } from '@modules/ticket/models/category/category.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { CommonServiceI } from '@interfaces/common-service.interface';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { User } from '@shared/models/user/user.model';
import { TicketI } from '@interfaces/ticket.interface';

export class Service implements CommonServiceI {
  id: number;
  categoryId: number;
  name: string;
  shortDescription: string;
  install: string;
  isHidden: boolean;
  hasCommonCase: boolean;
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
    this.isHidden = service.is_hidden;
    this.hasCommonCase = service.has_common_case;
    this.popularity = service.popularity;
    this.responsibleUsers = service.responsible_users || [];
    this.buildTickets(service.tickets);

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

  /**
   * Проверяет, есть ли указанный пользователь в списке ответственных за услугу.
   *
   * @param user - пользователь
   */
  isBelongsTo(user: User): boolean {
    return this.responsibleUsers.some(responsible => {
      return responsible.tn === user.tn;
    });
  }

  /**
   * Проверяет, есть ли указанный пользователь в списке ответственных во вложенных tickets.
   *
   * @param user - пользователь
   */
  isBelongsByTicketTo(user: User): boolean {
    return this.tickets.some(ticket => ticket.isBelongsTo(user));
  }

  private buildTickets(tickets: TicketI[]): void {
    if (!tickets || !tickets.length) {
      this.tickets = [];

      return;
    }

    this.tickets = tickets.map(ticket => TicketFactory.create(ticket)) || [];
  }
}
