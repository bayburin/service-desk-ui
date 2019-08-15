import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { Service } from '@modules/ticket/models/service/service.model';

interface RuntimeI {
  starttime: string;
  endtime: string;
  time: string;
  formatted_starttime: string;
  formatted_endtime: string;
  formatted_time: string;
  to_s: string;
}

export interface CaseI {
  case_id: number;
  service_id: number;
  service: Service;
  ticket_id: number;
  ticket: Ticket;
  without_service: boolean;
  user_tn: number;
  id_tn: number;
  user_info: string;
  dept: string;
  fio: string;
  host_id: string;
  invent_num: string;
  item_id: number;
  without_item: boolean;
  desc: string;
  phone: string;
  email: string;
  mobile: string;
  status_id: number;
  status: string;
  runtime: RuntimeI;
  rating: number;
}
