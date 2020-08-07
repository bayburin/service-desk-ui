import { TicketI } from './ticket.interface';

export interface ClaimFormI {
  id: number;
  description: string;
  destination: string;
  message: string;
  info: string;
  ticket: TicketI;
}
