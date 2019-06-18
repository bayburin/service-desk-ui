import { trigger, style, transition, animate, query, stagger, sequence } from '@angular/animations';

export const breadcrumbAnimation = trigger('breadcrumbAnimation', [
  transition(':enter', [
    style({ transform: 'translateX(-10%)', opacity: 0 }),
    animate('300ms ease-in-out', style({ transform: 'translateX(0%)', opacity: 1 }))
  ]),
]);

