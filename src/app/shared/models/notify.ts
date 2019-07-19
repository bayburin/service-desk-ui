import { CaseState } from './notify_states/case_state';
import { BroadcastState } from './notify_states/broadcast_state';
import { AbstractNotifyState } from './notify_states/abstract_notify_state';

export class Notify {
  id: number;
  eventType: string;
  tn: number;
  body: any;
  date: string;
  private state: AbstractNotifyState;

  constructor(notification: any = {}) {
    this.id = notification.id;
    this.eventType = notification.event_type;
    this.tn = notification.tn;
    this.body = notification.body;
    this.date = notification.date;

    this.createState();
  }

  /**
   * Возвращает иконку уведомления.
   */
  getIconName(): string {
    return this.state.getNotifyIconName();
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

  private createState() {
    if (this.isBroadcastEvent()) {
      this.state = new BroadcastState();
    } else if (this.isCaseEvent()) {
      this.state = new CaseState();
    } else {
      throw new Error('Неизвестный eventType');
    }
  }
}
