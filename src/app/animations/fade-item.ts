import { animate, query, style, transition, trigger, keyframes } from '@angular/animations';

export function fadeItem() {
  return trigger('fadeItem', [
    transition(':enter', [
      query('.container', style({ transform: 'scaleY(0)', transformOrigin: 'top', opacity: 0 })),
      query('.container', animate('300ms cubic-bezier(0.87, 0.59, 1, 1)', style({ transform: 'scaleY(1)', opacity: 1 }),
      )),
    ]),
    transition(':leave', [
      query('.container', style({ transform: 'scale(1)' })),
      query('.container', animate('200ms', style({ transform: 'scale(0)' }))),
    ])
  ]);
}
