import { AbstractNotifyState } from './abstract_notify_state';

export class ErrorState implements AbstractNotifyState {
  getIconName(): string {
    return 'mdi-alert';
  }

  getClassName(): string {
    return 'bg-danger text-light';
  }

  isAutoClose(): boolean {
    return false;
  }
}
