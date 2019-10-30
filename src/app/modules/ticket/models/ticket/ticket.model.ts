import { TicketFactory } from '@modules/ticket/factories/ticket.factory';
import { User } from '@shared/models/user/user.model';
import { Service } from '@modules/ticket/models/service/service.model';
import { CommonServiceI } from '@interfaces/common-service.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { AbstractTicketType } from './ticket_types/abstract-ticket.type';
import { QuestionType } from './ticket_types/question.type';
import { CaseType } from './ticket_types/case.type';
import { AnswerI } from '@interfaces/answer.interface';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { TagI } from '@interfaces/tag.interface';
import { TicketI } from '@interfaces/ticket.interface';

export class Ticket implements CommonServiceI {
  id: number;
  serviceId: number;
  originalId: number;
  name: string;
  ticketType: string;
  state: string;
  isHidden: boolean;
  sla: number;
  toApprove: boolean;
  popularity: number;
  service: Service;
  correction: Ticket;
  original: Ticket;
  open: boolean;
  answers: AnswerI[];
  responsibleUsers: ResponsibleUserI[];
  tags: TagI[];
  loading = false;
  private type: AbstractTicketType;

  constructor(ticket: any = {}) {
    this.id = ticket.id;
    this.serviceId = ticket.service_id;
    this.name = ticket.name;
    this.ticketType = ticket.ticket_type;
    this.state = ticket.state;
    this.isHidden = ticket.is_hidden;
    this.sla = ticket.sla;
    this.toApprove = ticket.to_approve;
    this.popularity = ticket.popularity;
    this.answers = ticket.answers || [];
    this.responsibleUsers = ticket.responsible_users || [];
    this.tags = ticket.tags || [];

    if (ticket.service) {
      this.service = ServiceFactory.create(ticket.service);
    }

    if (ticket.correction) {
      this.initializeCorrection(ticket.correction);
    }

    this.createTypeState();
  }

  getShowLink(): string {
    return this.type.getShowLink(this);
  }

  pageComponent(): string {
    return this.type.getPageContentComponent();
  }

  /**
   * Проверяет, является ли объект черновым.
   */
  isDraftState(): boolean {
    return this.state === 'draft';
  }

  /**
   * Проверяет, является ли объект готовым.
   */
  isPublishedState(): boolean {
    return this.state === 'published';
  }

  /**
   * Проверяет, является ли экземпляр вопросом.
   */
  isQuestionTicketType(): boolean {
    return this.ticketType === 'question';
  }

  /**
   * Проверяет, является ли экземпляр заявкой.
   */
  isCaseTicketType(): boolean {
    return this.ticketType === 'case';
  }

  /**
   * Проверяет, есть ли указанные пользователь в списке ответственных за ticket.
   *
   * @param user - пользователь
   */
  isBelongsTo(user: User): boolean {
    return this.responsibleUsers.some(responsible => responsible.tn === user.tn);
  }

  /**
   * Проверяет, есть ли указанный пользователь в списке ответственных за услугу.
   *
   * @param user - пользователь
   */
  isBelongsByServiceTo(user: User): boolean {
    return this.service.isBelongsTo(user);
  }

  /**
   * Установить состояние класса взависимости от типа ticketType.
   */
  private createTypeState(): void {
    if (this.isQuestionTicketType()) {
      this.type = new QuestionType();
    } else if (this.isCaseTicketType()) {
      this.type = new CaseType();
    } else {
      throw new Error('Unknown ticketType');
    }
  }

  private initializeCorrection(correction: TicketI) {
    this.correction = TicketFactory.create(correction);
    this.correction.original = this;
  }
}
