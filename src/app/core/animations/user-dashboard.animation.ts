import { trigger, style, transition, animate, query } from '@angular/animations';

export const userDashboardAnimation = trigger('userDashboardAnimation', [
  transition(':enter', [
    query(':self', [
      style({ opacity: 0, zIndex: 9999 }),
      animate('100ms ease-in-out', style({ opacity: 1 }))
    ])
  ]),
  transition(':leave', [
    query(':self', [
      style({ opacity: 1, zIndex: 9999 }),
      animate('100ms ease-in-out', style({ opacity: 0 }))
    ])
  ])
]);
