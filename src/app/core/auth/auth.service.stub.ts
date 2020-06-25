import { BehaviorSubject, of } from 'rxjs';

export class StubAuthService {
  isLoggedInSub = new BehaviorSubject<boolean>(false);
  isUserSignedIn = this.isLoggedInSub.asObservable();

  authorize() {}
  getAccessToken() { return of({}); }
  unauthorize() { return of({}); }
  clearAuthData() {}
  getToken() {}
  setReturnUrl() { return 'return url'; }
  getReturnUrl() {}
  isValidState() {}
}
