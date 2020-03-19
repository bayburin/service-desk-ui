import { PublishedState } from './states/published.state';
import { DraftState } from './states/draft.state';
import { User } from '@shared/models/user/user.model';
import { Service } from '@modules/ticket/models/service/service.model';
import { CommonServiceI } from '@interfaces/common-service.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { TagI } from '@interfaces/tag.interface';
import { AbstractState } from './states/abstract.state';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';

export const enum TicketTypes {
  QUESTION = 'question',
  CASE = 'case',
  COMMON_CASE = 'common_case'
}

export const enum TicketStates {
  DRAFT = 'draft',
  PUBLISHED = 'published'
}

export abstract class Ticket implements CommonServiceI {
  id: number;
  serviceId: number;
  originalId: number;
  name: string;
  isHidden: boolean;
  sla: number;
  toApprove: boolean;
  popularity: number;
  service: Service;
  open: boolean;
  responsibleUsers: ResponsibleUserI[];
  tags: TagI[];
  loading = false;
  readonly ticketType: TicketTypes;
  private stateValue: TicketStates;
  private ticketState: AbstractState;

  get state(): TicketStates {
    return this.stateValue;
  }

  set state(s: TicketStates) {
    this.stateValue = s;
    this.ticketState = this.isPublishedState() ? new PublishedState() : new DraftState();
  }

  constructor(ticket: any = {}) {
    this.id = ticket.id;
    this.serviceId = ticket.service_id;
    this.originalId = ticket.original_id;
    this.name = ticket.name;
    this.state = ticket.state;
    this.isHidden = ticket.is_hidden;
    this.sla = ticket.sla;
    this.toApprove = ticket.to_approve;
    this.popularity = ticket.popularity;
    this.responsibleUsers = ticket.responsible_users || [];
    this.tags = ticket.tags || [];

    if (ticket.service) {
      this.service = ServiceFactory.create(ticket.service);
    }
  }

  /**
   * Возвращает ссылку на текущий экземпляр тикета или ссылку на создание заявки.
   */
  abstract getShowLink(): string;

  /**
   * Возвращает компонент выбранного шаблона для выдачи пользователю.
   */
  abstract pageComponent(): string;

  /**
   * Проверяет, является ли объект черновым.
   */
  isDraftState(): boolean {
    return this.state === TicketStates.DRAFT;
  }

  /**
   * Проверяет, является ли объект готовым.
   */
  isPublishedState(): boolean {
    return this.state === TicketStates.PUBLISHED;
  }

  /**
   * Проверяет, является ли тикет вопросом.
   */
  isQuestionTicketType(): boolean {
    return this.ticketType === TicketTypes.QUESTION;
  }

  /**
   * Проверяет, является ли тикет заявкой.
   */
  isCaseTicketType(): boolean {
    return this.ticketType === TicketTypes.CASE;
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
    return this.service && this.service.isBelongsTo(user);
  }

  /**
   * Публикация тикета.
   */
  publish() {
    this.ticketState.publish(this);
  }

  /**
   * Возвращает список табельных номеров ответственных.
   */
  getResponsibleUsersTn(): number[] {
    return this.responsibleUsers.map(user => user.tn);
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
  }
}
