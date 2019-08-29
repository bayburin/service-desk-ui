import { BehaviorSubject } from 'rxjs';
import { TestBed, async, inject } from '@angular/core/testing';

import { ResponsibleGuard } from './responsible.guard';
import { User } from 'app/core/models/user/user.model';
import { UserFactory } from 'app/core/factories/user.factory';
import { UserService } from '@shared/services/user/user.service';
import { RoleI } from '@interfaces/role.interface';

const role = {
  id: 1,
  name: 'admin'
} as RoleI;
const UserI = {
  tn: 12_123,
  fio: 'Форточкина Клавдия Ивановна',
  dept: 714,
  role_id: 1,
  role: role
};
const user = UserFactory.create({ role: { name: 'admin' } });

class StubUserService {
  user = new BehaviorSubject<User>(user);
}

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
