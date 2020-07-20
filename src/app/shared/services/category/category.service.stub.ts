import { of, BehaviorSubject } from 'rxjs';
import { Category } from '@modules/ticket/models/category/category.model';

export class StubCategoryService {
  category$ = new BehaviorSubject<Category>(null);

  loadCategories() { return of({}); }
  loadCategory() { return of({}); }
  getParentNodeName() { return of(''); }
  getNodeName() { return of('Программные комплексы (из категории)'); }
}
