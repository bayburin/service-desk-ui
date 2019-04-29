import { Service } from '@modules/ticket/models/service.model';
import { CommonServiceI } from '@interfaces/common-service.interface';
import { CaseState } from './ticket_states/case_state';
import { AbstractTicketState } from './ticket_states/abstract_ticket_state';
import { QuestionState } from './ticket_states/question_state';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';

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
  state: AbstractTicketState;

  constructor(ticket: any = {}) {
    this.id = ticket.id || null;
    this.serviceId = ticket.service_id || null;
    this.name = ticket.name || '';
    this.ticketType = ticket.ticket_type || '';
    this.isHidden = ticket.is_hidden || true;
    this.sla = ticket.sla || 0;
    this.popularity = ticket.popularity || 0;
    this.service = ServiceFactory.create(ticket.service) || null;

    this.createState();
  }

  /**
   * Получить ссылку на просмотр текущего вопроса или ссылку на создание заявки.
   */
  getShowLink(): string {
    return this.state.getShowLink();
  }

  /**
   * Установить состояние класса взависимости от типа ticketType.
   */
  private createState(): void {
    if (this.ticketType === 'question') {
      this.state = new QuestionState(this);
    } else if (this.ticketType === 'case') {
      this.state = new CaseState(this);
    } else {
      throw new Error('Unknown ticketType');
    }
  }
}
