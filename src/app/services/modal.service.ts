import { Injectable } from '@angular/core';

type Handler = () => void;

@Injectable()
export class ModalService {

  private messageText: string = '';
  private visible: boolean = false;

  private handler: Handler = () => {};

  public get message(): string {
    return this.messageText;
  }

  public get isVisible(): boolean {
    return this.visible;
  }

  public execute(): void {
    this.handler();
    this.close();
  }

  public open(handler: Handler, message: string): void {
    this.handler = handler;
    this.messageText = message;
    this.visible = true;
  }

  public close(): void {
    this.visible = false;
  }
}
