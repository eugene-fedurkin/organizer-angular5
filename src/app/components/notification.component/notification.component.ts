import { Component } from '@angular/core';

import { staggerNotification } from '../../animations/stagger-notification';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [ staggerNotification() ],
})
export class NotificationComponent {

  public get messages(): string[] {
    return this.notify.notifyMessage;
  }

  constructor(public readonly notify: NotificationService) {}
}
