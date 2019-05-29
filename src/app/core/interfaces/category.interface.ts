import { ServiceI } from './service.interface';

export interface CategoryI {
  id: number;
  name: string;
  short_description: string;
  popularity: number;
  services?: ServiceI[];
}
