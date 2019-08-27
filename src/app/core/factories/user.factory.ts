import { User } from 'app/core/models/user/user';

export class UserFactory {
  static create(params = {}) {
    return new User(params || {});
  }
}
