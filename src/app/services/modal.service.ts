import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { Subject } from 'rxjs/Subject';
import { PublicFeature } from '@angular/core/src/render3';

type Handler = () => void;

@Injectable()
export class ModalService {

  private messageText: string = '';
  private visible: boolean = false;

  private modalResult: Subject<boolean>;

  public get message(): string {
    return this.messageText;
  }

  public get isVisible(): boolean {
    return this.visible;
  }

  public execute(): void {
    this.modalResult.next(true);
    this.modalResult.complete();
    this.visible = false;
  }

  public open(message: string): Observable<boolean> {
    this.messageText = message;
    this.visible = true;

    this.modalResult = new Subject<boolean>();
    return this.modalResult.asObservable();
  }

  public close(): void {
    this.modalResult.next(false);
    this.modalResult.complete();
    this.visible = false;
  }
}
