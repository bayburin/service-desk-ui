import { AbstractState } from './abstract.state';
import { Ticket, TicketStates } from '@modules/ticket/models/ticket/ticket.model';

export class DraftState extends AbstractState {
  publish(ticket: Ticket): void {
    ticket.state = TicketStates.PUBLISHED;
  }
}
