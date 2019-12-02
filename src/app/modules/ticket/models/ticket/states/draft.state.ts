import { AbstractState } from './abstract.state';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

export class DraftState extends AbstractState {
  publish(ticket: Ticket) {
    ticket.state = 'published';
  }
}
