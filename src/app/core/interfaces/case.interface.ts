interface RuntimeI {
  starttime: string;
  endtime: string;
  time: string;
  formatted_starttime: string;
  to_s: string;
}

export interface CaseI {
  case_id: number;
  service_id: number;
  ticket_id: number;
  without_service: boolean;
  user_tn: number;
  id_tn: number;
  user_info: string;
  dept: string;
  fio: string;
  host_id: string;
  item_id: number;
  without_item: boolean;
  desc: string;
  phone: string;
  email: string;
  mobile: string;
  status: string;
  runtime: RuntimeI;
}
