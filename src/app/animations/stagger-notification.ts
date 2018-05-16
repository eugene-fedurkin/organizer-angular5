import { animate, query, style, transition, trigger, stagger } from '@angular/animations';

export function staggerNotification() {
  return trigger('staggerNotification', [
    transition(':enter', [
      query('li', style({ transform: 'translateX(300px)', opacity: 0 })),
      query('li', animate('300ms cubic-bezier(0.87, 0.59, 1, 1)', style({ transform: 'translateX(0px)', opacity: 1 }),
      )),
    ]),
    transition(':leave', [
      query('li', style({ transform: 'translateX(0px)', opacity: 1 })),
      query('li', animate('200ms', style({ transform: 'translateX(300px)', opacity: 0 }))),
    ])
  ]);
}
