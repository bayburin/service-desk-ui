import { trigger, style, transition, animate } from '@angular/animations';

export const toggleAnswer = trigger('ToggleAnswer', [
  transition(':enter', [
    style({ height: 0 }),
    animate(100, style({ height: '*' }))
  ]),
  transition(':leave', [
    animate(100, style({ height: 0 }))
  ])
]);
