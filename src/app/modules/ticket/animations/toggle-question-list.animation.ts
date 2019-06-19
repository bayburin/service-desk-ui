import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

export const toggleQuestionList = trigger('ToggleQuestionList', [
  transition('* => *', [
    query(':enter', [
      style({
        opacity: 0,
        marginBottom: 0,
        transform: 'translateY(-10%)'
      }),
      stagger(30, [
        animate(50, style({
          opacity: 1,
          marginBottom: '*',
          transform: 'translateY(0%)'
        })),
      ])
    ], { optional: true }),
    query(':leave', [
      stagger(30, [
        animate(50, style({
          opacity: 0,
          height: 0,
          marginBottom: 0
        })),
      ])
    ], { optional: true }),
  ]),
]);
