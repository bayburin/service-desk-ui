import { TestBed, inject } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from '@auth/auth.service';
import { TicketModule } from '@modules/ticket/ticket.module';

class StubAuthService {
  isLoggedInSub = new BehaviorSubject<boolean>(false);
  isUserSignedIn = this.isLoggedInSub.asObservable();

  setReturnUrl() {}
  authorize() {}
}

describe('AuthGuard', () => {
  let authService: AuthService;
  let stubSnapshot: RouterStateSnapshot;
  let activatedRoute: ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TicketModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useClass: StubAuthService }
      ]
    });

    authService = TestBed.get(AuthService);
    stubSnapshot = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['url']);
    activatedRoute = new ActivatedRouteSnapshot();
  });

  it('should create', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should return true if user logged in', inject([AuthGuard], (guard: AuthGuard) => {
    authService.isLoggedInSub.next(true);

    guard.canActivate(activatedRoute, stubSnapshot).subscribe(result => {
      expect(result).toBeTruthy();
    });
  }));

  describe('when user does not logged in', () => {
    it('should call "setReturnUrl" method for AuthService', inject([AuthGuard], (guard: AuthGuard) => {
      spyOn(authService, 'setReturnUrl');
      guard.canActivate(activatedRoute, stubSnapshot).subscribe(() => {
        expect(authService.setReturnUrl).toHaveBeenCalledWith(stubSnapshot.url);
      });
    }));

    it('should call "authorize" method for AuthService', inject([AuthGuard], (guard: AuthGuard) => {
      spyOn(authService, 'authorize');
      guard.canActivate(activatedRoute, stubSnapshot).subscribe(() => {
        expect(authService.authorize).toHaveBeenCalled();
      });
    }));

    it('should return false', inject([AuthGuard], (guard: AuthGuard) => {
      guard.canActivate(activatedRoute, stubSnapshot).subscribe(result => {
        expect(result).toBeFalsy();
      });
    }));
  });
});
