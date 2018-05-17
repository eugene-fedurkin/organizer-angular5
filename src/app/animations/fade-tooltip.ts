import { animate, query, style, transition, trigger, keyframes } from '@angular/animations';

export function fadeTooltip() {
  return trigger('fadeTooltip', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('750ms cubic-bezier(0.215, 0.61, 0.355, 1)', keyframes([
        style({ transform: 'scale3d(0.3, 0.3, 0.3)', opacity: 0, offset: 0 }),
        style({ transform: 'scale3d(1.1, 1.1, 1.1)', opacity: 1, offset: 0.35 }),
        style({ transform: 'scale3d(0.9, 0.9, 0.9)', offset: 0.75 }),
        style({ transform: 'scale3d(1, 1, 1)', offset: 1 }),
      ]))
    ]),
    transition(':leave', [
      animate('750ms cubic-bezier(0.215, 0.61, 0.355, 1)', keyframes([
        style({ opacity: 1, offset: 0 }),
        style({ opacity: 0, offset: 1 }),
      ]))
    ])
  ]);
}
