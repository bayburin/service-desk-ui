import { TestBed, inject } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from '@auth/auth.service';
import { TicketModule } from '@modules/ticket/ticket.module';
import { StubAuthService } from '@auth/auth.service.stub';
import { UserService } from '@shared/services/user/user.service';
import { StubUserService, user } from '@shared/services/user/user.service.stub';

describe('AuthGuard', () => {
  let authService: AuthService;
  let userService: UserService;
  let stubSnapshot: RouterStateSnapshot;
  let activatedRoute: ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TicketModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useClass: StubAuthService },
        { provide: UserService, useClass: StubUserService }
      ]
    });

    authService = TestBed.get(AuthService);
    userService = TestBed.get(UserService);
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

  describe('when user is not valid and user logged in', () => {
    beforeEach(() => {
      authService.isLoggedInSub.next(true);
      spyOn(user, 'isValid').and.returnValue(false);
    });

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
