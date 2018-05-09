import { animate, query, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        query('.content', style({ transform: 'scale(0, 0)', opacity: 0.8 })),
        query('.content', animate('200ms cubic-bezier(.73,.59,.63,1.53)', style({ transform: 'scale(1, 1)', opacity: 1 }))),
      ]),
      transition(':leave', [
        query('.content', style({ transform: 'scale(1, 1)', opacity: 1 })),
        query('.content', animate('200ms cubic-bezier(.46,-0.65,.61,.81)', style({ transform: 'scale(0, 0)', opacity: 0.8 }))),
      ])
    ])
  ]
})
export class ModalComponent {

  public get isVisible(): boolean {
    return this.modal.isVisible;
  }
  public get message(): string {
    return this.modal.message;
  }

  public constructor(private modal: ModalService) {}

  public cancel(): void {
    this.modal.close();
  }

  public execute(): void {
    this.modal.execute();
  }
}
