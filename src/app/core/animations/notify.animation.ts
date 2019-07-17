import { trigger, style, transition, animate } from '@angular/animations';

export const notifyAnimation = trigger('notifyAnimation', [
  transition(':enter', [
    style({
      transform: 'translateY(-10%)',
      opacity: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      height: 0
    }),
    animate('300ms ease-in-out', style({
      transform: 'translateY(0%)',
      opacity: 1,
      marginBottom: '*',
      paddingTop: '*',
      paddingBottom: '*',
      height: '*'
    }))
  ]),
]);
