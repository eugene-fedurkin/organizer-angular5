import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

  public notifyMessage: string[] = [];

  public validationWarning(messasge: string): void {
    this.notifyMessage.push(messasge);
    console.log(this.notifyMessage);
    setTimeout(() => {this.notifyMessage.shift(); console.log(this.notifyMessage); }, 3000);
  }
}
