import { Ticket } from '../ticket/ticket.model';

export class QuestionTicket extends Ticket {
  constructor(questionTicket: any = {}) {
    super(questionTicket);
  }
}
