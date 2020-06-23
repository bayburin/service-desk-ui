import { of } from 'rxjs';

export class StubClaimService {
  getAll() { return of([]); }
  create() { return of({}); }
  revoke() { return of({}); }
  getRawValues() {}
  vote() { return of({}); }
  isClosed() {}
}
