import { ErrorState } from './notify_states/error_state';
import { CaseState } from './notify_states/case_state';
import { BroadcastState } from './notify_states/broadcast_state';
import { AbstractNotifyState } from './notify_states/abstract_notify_state';
import { NotificationBodyI } from '@interfaces/notification.interface';

export class Notify {
  id: number;
  eventType: string;
  tn: number;
  body: NotificationBodyI;
  date: string;
  delay = 15000;
  private state: AbstractNotifyState;

  constructor(notification: any = {}) {
    this.id = notification.id;
    this.eventType = notification.event_type;
    this.tn = notification.tn;
    this.body = notification.body || {};
    this.date = notification.date;

    this.createState();
  }

  setMessage(msg: string): void {
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
    return this.eventType === 'broadcast';
  }

  /**
   * Проверяет, является ли экземпляр массовым уведомлением.
   */
  isCaseEvent() {
    return this.eventType === 'case';
  }

  /**
   * Проверяет, является ли экземпляр сообщением об ошибке.
   */
  isErrorEvent() {
    return this.eventType === 'error';
  }

  private createState() {
    if (this.isBroadcastEvent()) {
      this.state = new BroadcastState();
    } else if (this.isCaseEvent()) {
      this.state = new CaseState();
    } else if (this.isErrorEvent()) {
      this.state = new ErrorState();
    } else {
      throw new Error('Неизвестный eventType');
    }
  }
}
