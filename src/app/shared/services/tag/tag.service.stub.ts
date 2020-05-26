import { of } from 'rxjs';

export class StubTagService {
  loadTags() { return of(''); }
  popular() { return of(''); }
}
