import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DropEvent } from 'ng-drag-drop';

import { IListHttpService } from '../../interfaces/i.list.http';
import { ListCreate } from '../../models/list-create.model';
import { List as ListModel } from '../../models/list.model';
import { CapitalizePipe } from '../../pipes/capitilize.pipe';
import { ModalService } from '../../services/modal.service';
import { NotificationService } from '../../services/notification.service';
import { Base } from '../base.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ transform: 'translateX(-365px)' }),
        animate('200ms', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ListComponent extends Base implements OnInit {

  @Input() public list: ListModel;
  @ViewChild('nameCategory') nameCategory: ElementRef;
  @Output() public deleteList = new EventEmitter();
  @Output() public editList = new EventEmitter();
  @Output() public openList = new EventEmitter();
  @Output() public changeListToItem = new EventEmitter();
  public isEditMod: boolean = false;
  public titleToEdit: string = '';

  public constructor(
    private readonly listHttp: IListHttpService,
    private readonly modal: ModalService,
    private readonly router: Router,
    private readonly notify: NotificationService,
  ) { super(); }

  public removeList(): void {
    if (this.list.id >= 0) {
      const message = 'Are you sure that you want to remove the category?';

      const sub = this.modal.open(message)
      .subscribe(result => {
        if (result) {
          this.handler();
        }
        sub.unsubscribe();
      });
    }
  }

  private handler(): void {
    this.listHttp.removeList(this.list.id)
    .takeUntil(this.componentDestroyed)
    .subscribe(
      list => {
        this.deleteList.emit(list.id);
        this.router.navigate(['lists']);
        this.notify.addNotification('The list has been removed');
      },
      error => this.notify.addNotification('Can\'t remove the list')
    );
  }

  public edit(): void {
    event.stopPropagation();
    if (this.list.id >= 0) {
      this.isEditMod = !this.isEditMod;

      if (this.isEditMod) {
        setTimeout(() => this.nameCategory.nativeElement.focus(), 0);
      } else {
        this.acceptChanges();
      }
    }
  }

  public acceptChanges(): void {
    this.isEditMod = false;

    const list = new ListCreate();
    this.titleToEdit = new CapitalizePipe().transform(this.titleToEdit);
    list.title = this.titleToEdit;

    this.listHttp.editList(list, this.list.id)
    .takeUntil(this.componentDestroyed)
    .subscribe(l => {
      this.editList.emit(l);
      this.notify.addNotification('The list has been edited');
    });
  }

  public cancelEdit(): void {
    if (this.isEditMod) this.titleToEdit = this.list.title;
    this.isEditMod = false;
  }

  public openItems(): void {
    if (this.list.id >= 0) {
      this.openList.emit(this.list.id);
    }
  }

  public onChangeListToItem(event: DropEvent): void {
    this.changeListToItem.emit({
      item: event.dragData,
      droppableListId: this.list.id,
    });
  }

  ngOnInit() {
    this.titleToEdit = this.list.title;
  }
}
