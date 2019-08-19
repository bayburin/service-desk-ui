import { ItemI } from './item.interface';
import { Service } from '@modules/ticket/models/service/service.model';

export interface UserOwnsI {
  services: Service[];
  items: ItemI[];
}
