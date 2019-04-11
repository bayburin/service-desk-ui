import { ItemI } from './item.interface';
import { ServiceI } from '@models/service.interface';

export interface UserOwnsI {
  services: ServiceI[];
  items: ItemI[];
}
