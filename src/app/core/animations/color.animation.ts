import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

export const colorAnimation = trigger('colorAnimation', [
  transition(':enter', [
    style({ backgroundColor: '#d3e2f2' }),
    animate('1500ms ease-in-out', style({ backgroundColor: '*' }))
  ]),
]);
