import { UserRecommendationI } from './user-recommendation.interface';
import { Service } from '@modules/ticket/models/service/service.model';
import { Category } from '@modules/ticket/models/category/category.model';

export interface DashboardI {
  categories: Category[];
  services: Service[];
  user_recommendations: UserRecommendationI[];
}
