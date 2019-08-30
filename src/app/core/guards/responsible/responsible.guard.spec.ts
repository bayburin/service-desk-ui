import { ActivatedRouteSnapshot } from '@angular/router';
import { TestBed, inject } from '@angular/core/testing';

import { ResponsibleGuard } from './responsible.guard';
import { UserService } from '@shared/services/user/user.service';
import { StubUserService, user } from '@shared/services/user/user.service.stub';
import { ServiceService } from '@shared/services/service/service.service';
import { StubServiceService } from '@shared/services/service/service.service.stub';
import { TicketPolicy } from '@shared/policies/ticket/ticket.policy';
import { StubServicePolicy } from '@shared/policies/service/service.policy.stub';
import { ServicePolicy } from '@shared/policies/service/service.policy';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';

describe('ResponsibleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ResponsibleGuard,
        { provide: UserService, useClass: StubUserService },
        { provide: ServiceService, useClass: StubServiceService },
        { provide: ServicePolicy, useClass: StubServicePolicy }
      ]
    });
  });

  it('should create', inject([ResponsibleGuard], (guard: ResponsibleGuard) => {
    expect(guard).toBeTruthy();
  }));

  describe('#calLoad', () => {
    describe('when roles from allowed pool', () => {
      const arr = ['content_manager', 'service_responsible'];
      arr.forEach(name => {
        it(`should return Observable with true value if user has "${name}" role`, inject([ResponsibleGuard], (guard: ResponsibleGuard) => {
          user.role.name = name;

          guard.canLoad().subscribe(result => {
            expect(result).toBeTruthy();
          });
        }));
      });
    });

    it('should return Observable with false value is user has another role', inject([ResponsibleGuard], (guard: ResponsibleGuard) => {
      user.role.name = 'test role';

      guard.canLoad().subscribe(result => {
        expect(result).toBeFalsy();
      });
    }));
  });

  describe('#canActivate', () => {
    let stubSnapshot: ActivatedRouteSnapshot;
    let stubSnapshotProxy;

    beforeEach(() => {
      stubSnapshot = jasmine.createSpyObj<ActivatedRouteSnapshot>('ActivatedRouteSnapshot', ['data']);
      stubSnapshotProxy = new Proxy(stubSnapshot, {
        get(target, prop) {
          if (prop === 'data') {
            return { policy: ServicePolicy };
          }
        }
      });
    });

    it('should return true if authorize policy returns true', inject([ResponsibleGuard], (guard: ResponsibleGuard) => {
      spyOn(TestBed.get(ServicePolicy), 'authorize').and.returnValue(true);

      expect(guard.canActivate(stubSnapshotProxy)).toBeTruthy();
    }));

    it('should return false if authorize policy returns false', inject([ResponsibleGuard], (guard: ResponsibleGuard) => {
      spyOn(TestBed.get(ServicePolicy), 'authorize').and.returnValue(false);

      expect(guard.canActivate(stubSnapshotProxy)).toBeFalsy();
    }));
  });
});
