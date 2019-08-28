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
  isHidden: boolean;
  sla: number;
  popularity: number;
  service: Service;
  open: boolean;
  answers: AnswerI[];
  responsibleUsers: ResponsibleUserI[];
  private state: AbstractTicketState;

  constructor(ticket: any = {}) {
    this.id = ticket.id;
    this.serviceId = ticket.service_id;
    this.name = ticket.name;
    this.ticketType = ticket.ticket_type;
    this.isHidden = ticket.is_hidden;
    this.sla = ticket.sla;
    this.popularity = ticket.popularity;
    this.answers = ticket.answers || [];
    this.responsibleUsers = ticket.responsible_users || [];

    if (ticket.service) {
      this.service = ServiceFactory.create(ticket.service);
    }

    this.createState();
  }

  getShowLink(): string {
    return this.state.getShowLink(this);
  }

  pageComponent(): string {
    return this.state.getPageContentComponent();
  }

  /**
   * Проверяет, является ли экземпляр вопросом.
   */
  isQuestion(): boolean {
    return this.ticketType === 'question';
  }

  /**
   * Проверяет, является ли экземпляр заявкой.
   */
  isCase(): boolean {
    return this.ticketType === 'case';
  }

  /**
   * Установить состояние класса взависимости от типа ticketType.
   */
  private createState(): void {
    if (this.isQuestion()) {
      this.state = new QuestionState();
    } else if (this.isCase()) {
      this.state = new CaseState();
    } else {
      throw new Error('Unknown ticketType');
    }
  }
}
