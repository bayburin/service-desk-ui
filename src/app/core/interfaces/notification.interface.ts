export interface NotificationBodyI {
  message: string;
  case_id?: number;
  user_tn?: number;
}

export interface NotificationI {
  id: number;
  event_type: string;
  tn: number;
  body: NotificationBodyI;
  date: string;
}
