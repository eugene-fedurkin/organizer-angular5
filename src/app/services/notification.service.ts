import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService { // TODO: remake

  public messageOptions: Array<{id: number, message: string}> = [];
  private notifyId: number[] = [];
  private id: number = 0;

  public addNotification(message: string, time: number = 3): void {
    this.notifyId.push(this.id);
    this.messageOptions.push({ id: this.id++, message });
    setTimeout(() => this.removeNotification(), time * 1000);
  }

  public removeNotification(): void {
    const notifyId = this.notifyId.shift();
    const index = this.messageOptions.findIndex(messageOption => messageOption.id === notifyId);

    if (index > -1) this.messageOptions.splice(index, 1);
  }
}
