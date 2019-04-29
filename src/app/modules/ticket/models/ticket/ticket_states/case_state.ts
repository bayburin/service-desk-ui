import { AbstractTicketState } from './abstract_ticket_state';

export class CaseState extends AbstractTicketState {
  getShowLink(): string {
    throw new Error('Need implementation');
  }
}
