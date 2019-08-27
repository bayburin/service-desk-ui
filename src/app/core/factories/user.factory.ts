import { User } from 'app/core/models/user/user.model';

export class UserFactory {
  static create(params = {}) {
    return new User(params || {});
  }
}
