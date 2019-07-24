import { Notify } from '@shared/models/notify';

export class NotifyFactory {
  static create(params = {}) {
    return new Notify(params);
  }
}
