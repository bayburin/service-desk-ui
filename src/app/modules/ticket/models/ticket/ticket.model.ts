import { PublishedState } from './states/published.state';
import { DraftState } from './states/draft.state';
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
import { Answer } from '@modules/ticket/models/answer/answer.model';
import { AnswerFactory } from '@modules/ticket/factories/answer.factory';
import { AbstractState } from './states/abstract.state';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';

export class Ticket implements CommonServiceI {
  id: number;
  serviceId: number;
  originalId: number;
  name: string;
  ticketType: string;
  isHidden: boolean;
  sla: number;
  toApprove: boolean;
  popularity: number;
  service: Service;
  correction: Ticket;
  original: Ticket;
  open: boolean;
  answers: Answer[];
  responsibleUsers: ResponsibleUserI[];
  tags: TagI[];
  loading = false;
  private _state: string;
  private type: AbstractTicketType;
  private questionState: AbstractState;

  get state(): string {
    return this._state;
  }

  set state(s: string) {
    this._state = s;
    this.createQuestionState();
  }

  constructor(ticket: any = {}) {
    this.id = ticket.id;
    this.serviceId = ticket.service_id;
    this.originalId = ticket.original_id;
    this.name = ticket.name;
    this.ticketType = ticket.ticket_type;
    this.state = ticket.state;
    this.isHidden = ticket.is_hidden;
    this.sla = ticket.sla;
    this.toApprove = ticket.to_approve;
    this.popularity = ticket.popularity;
    this.responsibleUsers = ticket.responsible_users || [];
    this.tags = ticket.tags || [];
    this.buildAnswers(ticket.answers);

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
    return this.service && this.service.isBelongsTo(user);
  }

  /**
   * Проверяет, совпадает ли указанный id с id модели, а также с id оригинала/черновика.
   *
   * @param id - проверяемый id
   */
  hasId(id: number): boolean {
    if (this.id == id) {
      return true;
    } else if (this.isDraftState()) {
      return this.originalId == id;
    } else if (this.isPublishedState()) {
      return this.correction && this.correction.id == id;
    } else {
      return false;
    }
  }

  /**
   * Публикация вопроса.
   */
  publish() {
    this.questionState.publish(this);
  }

  /**
   * Возвращает список табельных номеров ответственных.
   */
  getResponsibleUsersTn(): number[] {
    const correctionUsers = this.correction ? this.correction.getResponsibleUsersTn() : [];

    return this.responsibleUsers.map(user => user.tn).concat(...correctionUsers);
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
    if (this.correction) {
      this.correction.associateResponsibleUserDetails(details);
    }
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
      throw new Error('Неизвестный ticketType');
    }
  }

  private createQuestionState() {
    if (this.isPublishedState()) {
      this.questionState = new PublishedState();
    } else {
      this.questionState = new DraftState();
    }
  }

  private initializeCorrection(correction: TicketI) {
    this.correction = TicketFactory.create(correction);
    this.correction.original = this;
  }

  private buildAnswers(answers: AnswerI[]) {
    if (!answers || !answers.length) {
      this.answers = [];

      return;
    }

    this.answers = answers.map(answer => AnswerFactory.create(answer)) || [];
  }
}
