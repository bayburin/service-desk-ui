import { AbstractNotifyState } from './abstract_notify_state';

export class CaseState implements AbstractNotifyState {
  getNotifyIconName(): string {
    return 'mdi-clipboard-arrow-up-outline';
  }
}
