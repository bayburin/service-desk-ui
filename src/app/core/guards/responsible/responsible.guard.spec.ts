import { TestBed, inject } from '@angular/core/testing';

import { ResponsibleGuard } from './responsible.guard';
import { UserService } from '@shared/services/user/user.service';
import { StubUserService, user } from '@shared/services/user/user.service.stub';

describe('ResponsibleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ResponsibleGuard,
        { provide: UserService, useClass: StubUserService }
      ]
    });
  });

  it('should create', inject([ResponsibleGuard], (guard: ResponsibleGuard) => {
    expect(guard).toBeTruthy();
  }));

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
