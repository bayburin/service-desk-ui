import { trigger, style, transition, animate, state } from '@angular/animations';

export const showFlagRight = trigger('ShowFlagRight', [
  state('hide', style({ width: 0, opacity: 0 })),
  state('show', style({ width: '*', opacity: 1})),
  transition('hide => show', animate('100ms ease-in')),
  transition('show => hide', animate('100ms ease-out'))
]);
