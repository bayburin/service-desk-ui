import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';

import { StateGuard } from './state.guard';
import { AuthService } from '@auth/auth.service';
import { StubAuthService } from '@auth/auth.service.stub';

describe('StateGuard', () => {
  let authService: AuthService;
  let stubSnapshot: RouterStateSnapshot;
  let activatedRoute: ActivatedRouteSnapshot;
  let stubSnapshotProxy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        StateGuard,
        { provide: AuthService, useClass: StubAuthService }
      ]
    });

    authService = TestBed.get(AuthService);
    stubSnapshot = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['root']);
    stubSnapshotProxy = new Proxy(stubSnapshot, {
      get(target, prop) {
        if (prop === 'root') {
          return {
            queryParams: { state: 'test' }
          };
        }
      }
    });
    activatedRoute = new ActivatedRouteSnapshot();
  });

  it('should create', inject([StateGuard], (guard: StateGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should return true if method "isValidState" returns true', inject([StateGuard], (guard: StateGuard) => {
    spyOn(authService, 'isValidState').and.returnValue(true);

    expect(guard.canActivate(activatedRoute, stubSnapshotProxy)).toBeTruthy();
  }));

  describe('when method "isValidState" returns false', () => {
    beforeEach(inject([Router], (router: Router) => {
      spyOn(authService, 'isValidState').and.returnValue(false);
      spyOn(router, 'navigate');
    }));

    it('should redirect to "authorize_forbidden" page', inject([StateGuard, Router], (guard: StateGuard, router: Router) => {
      guard.canActivate(activatedRoute, stubSnapshotProxy);

      expect(router.navigate).toHaveBeenCalledWith(['authorize_forbidden']);
    }));

    it('should return false', inject([StateGuard], (guard: StateGuard) => {
      expect(guard.canActivate(activatedRoute, stubSnapshotProxy)).toBeFalsy();
    }));
  });
});
