import { Category } from '@modules/ticket/models/category/category.model';
import { Ticket, TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { CommonServiceI } from '@interfaces/common-service.interface';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { User } from '@shared/models/user/user.model';
import { TicketI } from '@interfaces/ticket.interface';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';
import { QuestionTicket } from '../question-ticket/question-ticket.model';

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
  questionTickets: QuestionTicket[];
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
    this.buildQuestionTickets(service.question_tickets);

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
    return this.responsibleUsers.some(responsible => responsible.tn === user.tn);
  }

  /**
   * Проверяет, есть ли указанный пользователь в списке ответственных во вложенных tickets.
   *
   * @param user - пользователь
   */
  isBelongsByTicketTo(user: User): boolean {
    return this.questionTickets.some(ticket => ticket.isBelongsTo(user));
  }

  /**
   * Возвращает список табельных номеров ответственных за услугу и вложенные вопросы.
   */
  getResponsibleUsersTn(): number[] {
    const ticketResponsibles = this.questionTickets.map(ticket => ticket.getResponsibleUsersTn());

    return this.responsibleUsers.map(user => user.tn).concat(...ticketResponsibles);
  }

  /**
   * Для ответственных пользователей устанавливает аттрибут "details", находя его в переданном массиве.
   *
   * @param details - массив, содержащий информацию об ответственных.
   */
  associateResponsibleUserDetails(details: ResponsibleUserDetailsI[]): void {
    this.responsibleUsers.forEach(user => {
      user.details = details.find(userDetails => user.tn === userDetails.tn);
    });
    this.questionTickets.forEach(ticket => ticket.associateResponsibleUserDetails(details));
  }

  private buildQuestionTickets(tickets: TicketI[]): void {
    if (!tickets || !tickets.length) {
      this.questionTickets = [];

      return;
    }

    this.questionTickets = tickets.map(ticket => TicketFactory.create(TicketTypes.QUESTION, ticket)) || [];
  }
}
