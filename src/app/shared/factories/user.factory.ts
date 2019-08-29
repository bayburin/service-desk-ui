import { User } from '@shared/models/user/user.model';

export class UserFactory {
  static create(params = {}) {
    return new User(params || {});
  }
}
