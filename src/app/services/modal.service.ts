import { Injectable } from '@angular/core';

type Handler = () => void;

@Injectable()
export class ModalService {

  public isVisible: boolean = false;

  private handler: Handler = () => {};
  public massage: string = '';

  public execute(): void {
    this.handler();
    this.cancel();
  }

  public open(handler: Handler, massage: string): void {
    this.handler = handler;
    this.massage = massage;
    this.isVisible = true;
  }

  public cancel(): void {
    this.isVisible = false;
  }
}