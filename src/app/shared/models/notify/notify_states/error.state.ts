import { AbstractNotifyState } from './abstract-notify.state';

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
