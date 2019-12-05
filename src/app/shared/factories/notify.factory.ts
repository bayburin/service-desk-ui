import { Notify } from '@shared/models/notify/notify.model';

export class NotifyFactory {
  static create(params = {}) {
    return new Notify(params);
  }
}
