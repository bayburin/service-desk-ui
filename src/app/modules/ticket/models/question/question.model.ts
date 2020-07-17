import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { Ticket } from '../ticket/ticket.model';
import { Answer } from '../answer/answer.model';
import { AnswerI } from '@interfaces/answer.interface';
import { AnswerFactory } from '@modules/ticket/factories/answer.factory';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';
import { TicketI } from '@interfaces/ticket.interface';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';

export class Question extends Ticket {
  originalId: number;
  answers: Answer[];
  correction: Question;
  original: Question;
  readonly ticketType = TicketTypes.QUESTION;

  constructor(question: any = {}) {
    super(question.ticket);
    this.id = question.id;
    this.originalId = question.original_id;

    if (question.correction) {
      this.initializeCorrection(question.correction);
    }

    this.buildAnswers(question.answers);
  }

  getShowLink(): string {
    return `/categories/${this.service.categoryId}/services/${this.serviceId}?identity=${this.identity}`;
  }

  pageComponent(): string {
    return 'app-question-page-content';
  }

  /**
   * Проверяет, совпадает ли указанный id с id модели, а также с id оригинала/черновика.
   *
   * @param id - проверяемый id
   */
  hasId(id: number): boolean {
    if (this.ticketId == id) {
      return true;
    } else if (this.isDraftState()) {
      return this.original && this.original.ticketId == id;
    } else if (this.isPublishedState()) {
      return this.correction && this.correction.ticketId == id;
    } else {
      return false;
    }
  }

  /**
   * Возвращает список табельных номеров ответственных.
   */
  getResponsibleUsersTn(): number[] {
    const correctionUsers = this.correction ? this.correction.getResponsibleUsersTn() : [];

    return super.getResponsibleUsersTn().concat(...correctionUsers);
  }

  /**
   * Для ответственных пользователей устанавливает аттрибут "details", находя его в переданном массиве.
   *
   * @param details - массив, содержащий информацию об ответственных.
   */
  associateResponsibleUserDetails(details: ResponsibleUserDetailsI[]): void {
    super.associateResponsibleUserDetails(details);
    if (this.correction) {
      this.correction.associateResponsibleUserDetails(details);
    }
  }

  private buildAnswers(answers: AnswerI[]): void {
    if (!answers || !answers.length) {
      this.answers = [];

      return;
    }

    this.answers = answers.map(answer => AnswerFactory.create(answer)) || [];
  }

  private initializeCorrection(correction: TicketI) {
    this.correction = TicketFactory.create(TicketTypes.QUESTION, correction) as Question;
    this.correction.original = this;
  }
}
