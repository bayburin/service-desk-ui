import { trigger, state, style, transition, animate } from '@angular/animations';

export const toggleAnswer = trigger('ToggleAnswer', [
  state('expanded', style({ height: '*' })),
  state('collapsed', style({ height: 0 })),
  transition('expanded <=> collapsed', animate(100))
]);
