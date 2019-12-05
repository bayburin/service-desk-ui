import { of } from 'rxjs';

export class StubSearchService {
  search() { return of([{}]); }
  deepSearch() { return of([{}]); }
}
