import { ItemI } from './item.interface';
import { Service } from '@modules/ticket/models/service.model';

export interface UserOwnsI {
  services: Service[];
  items: ItemI[];
}
