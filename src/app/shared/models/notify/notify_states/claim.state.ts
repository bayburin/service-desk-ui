import { AbstractNotifyState } from './abstract-notify.state';

export class ClaimState implements AbstractNotifyState {
  getIconName(): string {
    return 'mdi-clipboard-arrow-up-outline';
  }

  getClassName(): string {
    return '';
  }

  isAutoClose(): boolean {
    return true;
  }
}
