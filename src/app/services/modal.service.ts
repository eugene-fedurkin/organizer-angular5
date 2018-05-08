import { Injectable } from '@angular/core';

type Handler = () => void;

@Injectable()
export class ModalService {

  public isVisible: boolean = false;

  private handler: Handler = () => {};
  public message: string = '';

  public execute(): void {
    this.handler();
    this.cancel();
  }

  public open(handler: Handler, message: string): void {
    this.handler = handler;
    this.message = message;
    this.isVisible = true;
  }

  public cancel(): void {
    this.isVisible = false;
  }
}