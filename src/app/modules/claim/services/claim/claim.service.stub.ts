import { of } from 'rxjs';

export class StubClaimService {
  getAllCases() { return of([]); }
  createCase() { return of({}); }
  revokeCase() { return of({}); }
  getRawValues() {}
  voteCase() { return of({}); }
  isClosed() {}
}
