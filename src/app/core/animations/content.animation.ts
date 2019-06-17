import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

export const contentAnimation = trigger('contentAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ transform: 'translateY(10%)', opacity: 0 }),
      stagger(75, [
        animate(
          '0.5s ease-in-out',
          style({ transform: 'translateY(0%)', opacity: 1 })
        )
      ])
    ], { optional: true })
  ])
]);
