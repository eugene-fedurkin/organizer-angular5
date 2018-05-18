import { animate, query, style, transition, trigger, keyframes } from '@angular/animations';

export function bounceTop() {
  return trigger('bounceTop', [
    transition(':enter', [
      query('agm-map', style({ display: 'none' })),
      query('.container', animate('500ms', keyframes([
        style({ transform: 'scale(0.9, 0.9) translateY(-150%)', opacity: 0.8, offset: 0 }),
        style({ transform: 'scale(0.9, 0.9) translateY(-50%)', opacity: 0.8, offset: 0.3 }),
        style({ transform: 'scale(0.85, 0.85) translateY(0px)', opacity: 0.8, offset: 0.6 }),
        style({ transform: 'scale(0.85, 0.85) translateY(0px)', opacity: 0.8, offset: 0.75 }),
        style({ transform: 'scale(1, 1) translateY(0px)', opacity: 1, offset: 1 }),
      ]))),
      query('agm-map', style({ display: 'inline-block' })),
    ]),
    transition(':leave', [
      query('.container', animate('500ms', keyframes([
        style({ transform: 'scale(1, 1) translateY(0px)', opacity: 1, offset: 0 }),
        style({ transform: 'scale(0.85, 0.85) translateY(0px)', opacity: 0.8, offset: 0.15 }),
        style({ transform: 'scale(0.85, 0.85) translateY(0px)', opacity: 0.8, offset: 0.3 }),
        style({ transform: 'scale(0.9, 0.9) translateY(-50%)', opacity: 0.8, offset: 0.6 }),
        style({ transform: 'scale(0.9, 0.9) translateY(-150%)', opacity: 0.8, offset: 0.9 }),
      ]))),
    ])
  ]);
}
