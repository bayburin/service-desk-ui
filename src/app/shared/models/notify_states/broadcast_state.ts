import { AbstractNotifyState } from './abstract_notify_state';

export class BroadcastState implements AbstractNotifyState {
  getNotifyIconName(): string {
    return 'mdi-information-outline';
  }
}
