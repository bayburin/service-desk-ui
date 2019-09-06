import { AbstractNotifyState } from './abstract-notify.state';

export class BroadcastState implements AbstractNotifyState {
  getIconName(): string {
    return 'mdi-information-outline';
  }

  getClassName(): string {
    return '';
  }

  isAutoClose(): boolean {
    return true;
  }
}
