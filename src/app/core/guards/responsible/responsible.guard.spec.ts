import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { TestBed, inject } from '@angular/core/testing';
import { of, Observable } from 'rxjs';

import { ResponsibleGuard } from './responsible.guard';
import { UserService } from '@shared/services/user/user.service';
import { StubUserService, user } from '@shared/services/user/user.service.stub';
import { ServiceService } from '@shared/services/service/service.service';
import { StubServiceService } from '@shared/services/service/service.service.stub';
import { StubServicePolicy } from '@shared/policies/service/service.policy.stub';
import { ServicePolicy } from '@shared/policies/service/service.policy';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';

describe('ResponsibleGuard', () => {
  let guard: ResponsibleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        ResponsibleGuard,
        { provide: UserService, useClass: StubUserService },
        { provide: ServiceService, useClass: StubServiceService },
        { provide: ServicePolicy, useClass: StubServicePolicy }
      ]
    });

    guard = TestBed.get(ResponsibleGuard);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('#calLoad', () => {
    describe('when roles from allowed pool', () => {
      const arr = ['content_manager', 'service_responsible'];

      arr.forEach(name => {
        it(`should return Observable with true value if user has "${name}" role`, () => {
          user.role.name = name;

          guard.canLoad().subscribe(result => {
            expect(result).toBeTruthy();
          });
        });
      });
    });

    it('should return Observable with false value is user has another role', () => {
      user.role.name = 'test role';

      guard.canLoad().subscribe(result => {
        expect(result).toBeFalsy();
      });
    });

    it('should redirect to home page if user instance is empty', inject([Router], (router: Router) => {
      user.tn = null;
      spyOn(router, 'navigate');

      guard.canLoad().subscribe(result => {
        expect(result).toBeFalsy();
        expect(router.navigate).toHaveBeenCalledWith(['']);
      });
    }));
  });

  describe('#canActivate', () => {
    let stubSnapshot: ActivatedRouteSnapshot;
    let stubSnapshotProxy;
    let serviceService: ServiceService;
    const service = ServiceFactory.create({ id: 1, name: 'Тестовая услуга' });
    const action = 'myAction';

    beforeEach(() => {
      stubSnapshot = jasmine.createSpyObj<ActivatedRouteSnapshot>('ActivatedRouteSnapshot', ['data']);
      stubSnapshotProxy = new Proxy(stubSnapshot, {
        get(target, prop) {
          if (prop === 'data') {
            return {
              policy: ServicePolicy,
              action: action
            };
          }
        }
      });

      spyOn(guard as any, 'serviceIdInParentRoute').and.returnValue(1);
      spyOn(guard as any, 'categoryIdInParentRoute').and.returnValue(2);
    });

    describe('when service already loaded', () => {
      beforeEach(() => {
        serviceService = TestBed.get(ServiceService);
        serviceService.service = service;
      });

      it('should use current service to authorize user', () => {
        const policy = TestBed.get(ServicePolicy);
        spyOn(policy, 'authorize');

        guard.canActivate(stubSnapshotProxy);
        expect(policy.authorize).toHaveBeenCalledWith(service, action);
      });

      it('should return true if authorize policy returns true', () => {
        spyOn(TestBed.get(ServicePolicy), 'authorize').and.returnValue(true);

        expect(guard.canActivate(stubSnapshotProxy)).toBeTruthy();
      });

      it('should return false if authorize policy returns false', () => {
        spyOn(TestBed.get(ServicePolicy), 'authorize').and.returnValue(false);

        expect(guard.canActivate(stubSnapshotProxy)).toBeFalsy();
      });
    });

    describe('when service not loaded', () => {
      beforeEach(() => {
        serviceService = TestBed.get(ServiceService);
        spyOn(serviceService, 'loadService').and.returnValue(of(service));
      });

      it('should load service from api server to authorize user', () => {
        guard.canActivate(stubSnapshotProxy);

        expect(serviceService.loadService).toHaveBeenCalled();
      });

      it('should use loaded service to authorize user', () => {
        const policy = TestBed.get(ServicePolicy);
        spyOn(policy, 'authorize').and.returnValue(true);
        
        const result = guard.canActivate(stubSnapshotProxy);
        if (result instanceof Observable) {
          result.subscribe(access => {
            expect(access).toBeTruthy();
            expect(policy.authorize).toHaveBeenCalledWith(service, action);
          });
        }
      });

      it('should redirect to home page if user does not have access', inject([Router], (router: Router) => {
        const policy = TestBed.get(ServicePolicy);
        spyOn(policy, 'authorize').and.returnValue(false);
        spyOn(router, 'navigate');

        const result = guard.canActivate(stubSnapshotProxy);
        if (result instanceof Observable) {
          result.subscribe(access => {
            expect(access).toBeFalsy();
            expect(router.navigate).toHaveBeenCalledWith(['']);
            // expect(policy.authorize).toHaveBeenCalledWith(service, action);
          });
        }
      }));
    });
  });
});
