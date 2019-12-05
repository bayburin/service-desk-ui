import { AbstractNotifyState } from './abstract-notify.state';

export class LocalState implements AbstractNotifyState {
  getIconName(): string {
    return 'mdi-card-text-outline';
  }

  getClassName(): string {
    return 'bg-info';
  }

  isAutoClose(): boolean {
    return true;
  }
}