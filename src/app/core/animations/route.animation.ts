import { trigger, style, transition, animate, query, sequence, stagger } from '@angular/animations';

export const routeAnimation = trigger('routeAnimation', [
  transition('* => *', [
    query(':enter > *', style({ opacity: 0, position: 'fixed', width: '100%' }), { optional: true }),
    query(':enter .animate-element', style({ opacity: 0 }), { optional: true }),
    sequence([
      query(':leave > *', [
        style({
          transform: 'translateY(0%)',
          opacity: 1,
          position: 'fixed',
          width: '100%'
        }),
        animate('200ms ease-in-out', style({ transform: 'translateY(-3%)', opacity: 0 })),
        style({ position: 'fixed', width: '100%' })
      ], { optional: true }),
      query(':enter > *', [
        style({ transform: 'translateY(-3%)', opacity: 0 }),
        animate('500ms ease-in-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ], { optional: true })
    ]),
    query(':enter .animate-element', [
      style({ transform: 'translateY(10%)', opacity: 0 }),
      stagger(75, animate('500ms ease-in-out', style({ transform: 'translateY(0%)', opacity: 1 })))
    ], { optional: true })
  ])
]);
