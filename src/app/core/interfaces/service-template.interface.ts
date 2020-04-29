import { TicketI } from './ticket.interface';

export interface ServiceTemplateI {
  id: number;
  name: string;
  ticket: TicketI;
  category_id?: number;
  service_id?: number;
}
