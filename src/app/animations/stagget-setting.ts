import { trigger, transition, style, query, animate, stagger } from '@angular/animations';

export function staggerSetting() {
  return trigger('listAnimation', [
    transition(':enter', [
      query('li', style({ transform: 'translateX(100px)', opacity: 0 })),
      query('li', stagger('150ms', [
        animate('200ms', style({ transform: 'translateX(0px)', opacity: 1 }))
      ])),
    ]),
    transition(':leave', [
      query('li', style({ transform: 'translateX(0px)', opacity: 1 })),
      query('li', stagger('75ms', [
        animate('200ms', style({ transform: 'translateX(100px)', opacity: 0 }))
      ])),
    ]),
  ]);
}
