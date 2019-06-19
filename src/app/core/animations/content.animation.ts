import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

export const contentListAnimation = trigger('contentListAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ transform: 'translateY(10%)', opacity: 0 }),
      stagger(75, [animate('300ms ease-in-out', style({ transform: 'translateY(0%)', opacity: 1 }))])
    ], { optional: true }),
    query(':leave > *', [
      style({ transform: 'translateY(0%)', opacity: 1 }),
      animate('100ms ease-in-out', style({ transform: 'translateY(-3%)', opacity: 0 }))
    ], { optional: true })
  ])
]);

export const contentBlockAnimation = trigger('contentBlockAnimation', [
  transition(':enter', [
    style({ transform: 'translateY(10%)', opacity: 0 }),
    animate('300ms ease-in-out', style({ transform: 'translateY(0%)', opacity: 1 }))
  ]),
]);
