import { RoleI } from '@interfaces/role.interface';
import { User } from './user';

describe('User', () => {
  const userI = { tn: 12_123, dept: 714, fio: 'Форточкина Клавдия Ивановна', role_id: 1 };
  let user: User;

  beforeEach(() => {
    user = new User(userI);
  });

  it('should create instance of Notify', () => {
    expect(user).toBeTruthy();
  });

  it('should accept values', () => {
    expect(user.tn).toEqual(userI.tn);
    expect(user.fio).toEqual(userI.fio);
    expect(user.dept).toEqual(userI.dept);
  });

  describe('#hasRole', () => {
    const role: RoleI = { id: 1, name: 'admin', short_description: 'Администратор', long_description: '' };

    it('should return true if role the same', () => {
      user.role = role;

      expect(user.hasRole('admin')).toBeTruthy();
    });
  });
});
