import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

export interface ServiceTemplateI {
  id: number;
  name: string;
  category_id?: number;
  service_id?: number;
  ticket_type?: TicketTypes;
}
