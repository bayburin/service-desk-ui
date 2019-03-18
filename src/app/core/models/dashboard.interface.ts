import { ServiceI } from './service.interface';
import { CategoryI } from './category.interface';

export interface DashboardI {
  categories: CategoryI[];
  services: ServiceI[];
}
