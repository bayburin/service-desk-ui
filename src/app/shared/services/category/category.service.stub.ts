import { of } from 'rxjs';

export class StubCategoryService {
  loadCategories() {}
  loadCategory() {}
  getParentNodeName() { return of(''); }
  getNodeName() { return of('Программные комплексы (из категории)'); }
}
