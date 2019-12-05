import { ResponsibleUserDetailsI } from './responsible_user_details.interface';

export interface ResponsibleUserI {
  id: number;
  responseable_type: string;
  responseable_id: number;
  tn: number;
  details: ResponsibleUserDetailsI;
  _destroy?: boolean;
}
