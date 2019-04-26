import { ServiceI } from '@interfaces/service.interface';

export interface TicketI {
  id: number;
  service_id: number;
  name: string;
  short_description: string;
  popularity: number;
  service?: ServiceI;
  open?: boolean;
}
