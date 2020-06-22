import { Notify, NotifyTypes } from '@shared/models/notify/notify.model';

export class NotifyFactory {
  static create(params = {}): Notify {
    return new Notify(params);
  }

  static createAlert(msg: string): Notify {
    const notification = NotifyFactory.create({ event_type: NotifyTypes.ERROR });

    notification.message = msg;

    return notification;
  }
}
