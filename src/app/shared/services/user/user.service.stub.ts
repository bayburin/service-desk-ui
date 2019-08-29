import { BehaviorSubject, of } from 'rxjs';

import { UserFactory } from '@shared/factories/user.factory';
import { User } from '@shared/models/user/user.model';
import { RoleI } from '@interfaces/role.interface';

export const roleI = {
  id: 1,
  name: 'content_manager',
  short_description: 'Короткое описание',
  long_description: 'Длинное описание'
} as RoleI;

export const userI = {
  id_tn: 32_321,
  tn: 12_123,
  fio: 'Форточкина Клавдия Ивановна',
  email: 'fortochkina',
  tel: '50-50',
  dept: 714,
  role_id: 1,
  role: roleI
};

export const user = UserFactory.create(userI);

export class StubUserService {
  user = new BehaviorSubject<User>(user);

  loadUserInfo() { return of(user); }
  loadUserOwns() {}
  setUser() {}
  clearUser() {}
}
