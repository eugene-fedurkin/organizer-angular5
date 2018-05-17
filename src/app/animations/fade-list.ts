import { animate, query, style, transition, trigger } from '@angular/animations';

export function fadeList() {
  return trigger('fadeOut', [
    transition(':leave', [
      style({ opacity: 1, transform: 'translateX(0)' }),
      animate('300ms', style({ opacity: 0, transform: 'translateX(-150px)' }))
    ])
  ]);
}
