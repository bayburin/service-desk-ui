import { Ticket } from '../ticket/ticket.model';

export class CaseTicket extends Ticket {
  constructor(caseTicket: any = {}) {
    super(caseTicket);
  }
}
