import { Category } from '@modules/ticket/models/category/category.model';

export class CategoryFactory {
  static create(params) {
    return new Category(params);
  }
}
