import { Service } from '@modules/ticket/models/service.model';
import { Category } from '@modules/ticket/models/category.model';

export interface DashboardI {
  categories: Category[];
  services: Service[];
}