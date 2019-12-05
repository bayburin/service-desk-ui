import { RoleI } from '@interfaces/role.interface';
import { User } from './user.model';

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

  describe('#hasOneOfRoles', () => {
    const role: RoleI = { id: 1, name: 'admin', short_description: 'Администратор', long_description: '' };

    it('should return true user role is in array', () => {
      user.role = role;

      expect(user.hasOneOfRoles(['admin', 'guest'])).toBeTruthy();
      expect(user.hasOneOfRoles(['guest'])).toBeFalsy();
    });
  });

  describe('#isValid', () => {
    it('should return false if role is empty', () => {
      user.role = null;

      expect(user.isValid()).toBeFalsy();
    });

    it('should return false if tn is empty', () => {
      user.tn = null;

      expect(user.isValid()).toBeFalsy();
    });

    it('should return false if fio is empty', () => {
      user.fio = null;

      expect(user.isValid()).toBeFalsy();
    });
  });
});
