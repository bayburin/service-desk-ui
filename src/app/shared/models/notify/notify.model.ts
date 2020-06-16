import { LocalState } from './notify_states/local.state';
import { ErrorState } from './notify_states/error.state';
import { ClaimState } from './notify_states/claim.state';
import { BroadcastState } from './notify_states/broadcast.state';
import { AbstractNotifyState } from './notify_states/abstract-notify.state';
import { NotificationBodyI } from '@interfaces/notification.interface';

export const enum NotifyTypes {
  BROADCAST = 'broadcast',
  CLAIM = 'claim',
  ERROR = 'error'
}

export class Notify {
  id: number;
  mockId = 0;
  eventType: NotifyTypes;
  tn: number;
  date: string;
  delay = 15000;
  private body: NotificationBodyI;
  private state: AbstractNotifyState;

  constructor(notification: any = {}) {
    this.id = notification.id;
    this.mockId = notification.mockId;
    this.eventType = notification.event_type;
    this.tn = notification.tn;
    this.body = notification.body || {};
    this.date = notification.date;

    if (notification.message) {
      this.message = notification.message;
    }

    this.createState();
  }

  get message(): string {
    return this.body.message;
  }

  set message(msg: string) {
    this.body.message = msg;
  }

  /**
   * Возвращает иконку уведомления.
   */
  getIconName(): string {
    return this.state.getIconName();
  }

  /**
   * Возвращает класс цвета фона и цвета текста.
   */
  getClassName(): string {
    return this.state.getClassName();
  }

  /**
   * Определяет, закрывать ли уведомление автоматически.
   */
  isAutoClose(): boolean {
    return this.state.isAutoClose();
  }

  /**
   * Проверяет, является ли экземпляр массовым уведомлением.
   */
  isBroadcastEvent(): boolean {
    return this.eventType === NotifyTypes.BROADCAST;
  }

  /**
   * Проверяет, является ли экземпляр массовым уведомлением.
   */
  isClaimEvent() {
    return this.eventType === NotifyTypes.CLAIM;
  }

  /**
   * Проверяет, является ли экземпляр сообщением об ошибке.
   */
  isErrorEvent() {
    return this.eventType === NotifyTypes.ERROR;
  }

  private createState() {
    if (this.isBroadcastEvent()) {
      this.state = new BroadcastState();
    } else if (this.isClaimEvent()) {
      this.state = new ClaimState();
    } else if (this.isErrorEvent()) {
      this.state = new ErrorState();
    } else {
      this.state = new LocalState();
    }
  }
}
