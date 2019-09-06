import { User } from '@shared/models/user/user.model';
import { Service } from '@modules/ticket/models/service/service.model';
import { CommonServiceI } from '@interfaces/common-service.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { AbstractTicketState } from './ticket_states/abstract_ticket_state';
import { QuestionState } from './ticket_states/question_state';
import { CaseState } from './ticket_states/case_state';
import { AnswerI } from '@interfaces/answer.interface';
import { ResponsibleUserI } from '@interfaces/responsible_user.interface';

export class Ticket implements CommonServiceI {
  id: number;
  serviceId: number;
  name: string;
  ticketType: string;
  state: string;
  isHidden: boolean;
  sla: number;
  popularity: number;
  service: Service;
  open: boolean;
  answers: AnswerI[];
  responsibleUsers: ResponsibleUserI[];
  private type: AbstractTicketState;

  constructor(ticket: any = {}) {
    this.id = ticket.id;
    this.serviceId = ticket.service_id;
    this.name = ticket.name;
    this.ticketType = ticket.ticket_type;
    this.state = ticket.state;
    this.isHidden = ticket.is_hidden;
    this.sla = ticket.sla;
    this.popularity = ticket.popularity;
    this.answers = ticket.answers || [];
    this.responsibleUsers = ticket.responsible_users || [];

    if (ticket.service) {
      this.service = ServiceFactory.create(ticket.service);
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
   */
  isBelongsTo(user: User): boolean {
    return this.responsibleUsers.some(responsible => responsible.tn === user.tn);
  }

  /**
   * Установить состояние класса взависимости от типа ticketType.
   */
  private createTypeState(): void {
    if (this.isQuestionTicketType()) {
      this.type = new QuestionState();
    } else if (this.isCaseTicketType()) {
      this.type = new CaseState();
    } else {
      throw new Error('Unknown ticketType');
    }
  }
}
