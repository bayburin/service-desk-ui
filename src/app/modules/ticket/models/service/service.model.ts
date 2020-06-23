import { Category } from '@modules/ticket/models/category/category.model';
import { Ticket, TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { CommonServiceI } from '@interfaces/common-service.interface';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { User } from '@shared/models/user/user.model';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';
import { Question } from '../question/question.model';
import { ClaimForm } from '../claim-form/claim-form.model';
import { QuestionI } from '@interfaces/question.interface';

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
  // tickets: Ticket[];
  questions: Question[];
  claimForms: ClaimForm[] = [];
  responsibleUsers: ResponsibleUserI[];

  get tickets(): Ticket[] {
    return [...this.questions, ...this.claimForms];
  }

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
    this.buildQuestions(service.questions);

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
    return this.tickets.some(ticket => ticket.isBelongsTo(user));
  }

  /**
   * Возвращает список табельных номеров ответственных за услугу и вложенные вопросы.
   */
  getResponsibleUsersTn(): number[] {
    const ticketResponsibles = this.tickets.map(ticket => ticket.getResponsibleUsersTn());

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
    this.tickets.forEach(ticket => ticket.associateResponsibleUserDetails(details));
  }

  private buildQuestions(questions: QuestionI[]): void {
    if (!questions || !questions.length) {
      this.questions = [];

      return;
    }

    this.questions = questions.map(question => TicketFactory.create(TicketTypes.QUESTION, question)) || [];
  }
}
