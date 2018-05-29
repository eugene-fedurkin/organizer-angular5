import 'snazzy-info-window/dist/snazzy-info-window.min.css';

import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMyDateModel, IMyDpOptions } from 'mydatepicker';
import { Observable } from 'rxjs/Observable';

import { bounceTop } from '../../animations/bounce-edit-form';
import { CanComponentDeactivate } from '../../interfaces/i.deactivate';
import { IItemHttpService } from '../../interfaces/i.item.http';
import { Item } from '../../models/item.model';
import { Marker } from '../../models/marker.model';
import { User } from '../../models/user.model';
import { ModalService } from '../../services/modal.service';
import { NotificationService } from '../../services/notification.service';
import { Store } from '../../services/store.service';
import { UnsavedEntitiesFactory } from '../../services/unsaved-entities-factory.service';
import { Base } from '../base.component';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css'],
  animations: [ bounceTop() ],
})
export class EditFormComponent extends Base implements OnInit, CanComponentDeactivate {

  @HostBinding('@bounceTop') private animateProfile = true;
  @ViewChild('search') public search: ElementRef;

  private listId: number;
  private itemId: number;
  public savedItem: Item;
  public item: Item;

  public dateModel: any = { date: { } };
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
  };

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly http: IItemHttpService,
    private readonly modal: ModalService,
    private readonly notify: NotificationService,
    private readonly unsavedFactoty: UnsavedEntitiesFactory,
  ) { super(); }

  public saveChanges(): void {
    if (!this.titleIsCorrect()) {
      this.notify.addNotification('Need to add title');
      return;
    }

    this.saveProps(this.savedItem, this.item);
    const temporaryItem = this.unsavedFactoty.createItem(this.savedItem);
    this.saveProps(this.savedItem, temporaryItem);

    const subscr = this.http.updateItem(this.item)
      .finally(() => {
        subscr.unsubscribe();
        this.unsavedFactoty.removeTemporaryItem(temporaryItem.id);
      })
      .subscribe(item => {
        this.saveProps(this.savedItem, item);
        this.notify.addNotification('Item has been saved');
      }, error => {
        const actualItem = this.unsavedFactoty.getCurrentItem(temporaryItem.id);

        this.saveProps(this.savedItem, actualItem);
        this.notify.addNotification('Failed to save the item');
      }
    );
    this.closeForm();
  }

  public closeForm(): void {
    this.router.navigate(['lists', this.listId, this.itemId, 'details']);
  }

  public closeFormOutsideClick(event?: Event): void {
    event.stopPropagation();
    if (event && event.target === event.currentTarget) {
      this.closeForm();
    }
  }

  public dateChanges(event: IMyDateModel): void {
    this.dateModel.date.year = event.date.year;
    this.dateModel.date.month = event.date.month;
    this.dateModel.date.day = event.date.day;

    if (!event.date.day || !event.date.month || !event.date.month) {
      this.item.dueDate = null;
      return;
    }

    this.item.dueDate = `${this.dateModel.date.year}-${this.dateModel.date.month}-${this.dateModel.date.day}`;
  }

  public saveMarkerData(marker: Marker): void {
    this.item.mapMarker = marker;
  }

  public titleIsCorrect(): boolean {
    return !!this.item.title.trim();
  }

  public ngOnInit() {
    this.route.parent.params
      .subscribe(param => this.itemId = +param.itemId);
    this.route.parent.parent.params
      .subscribe(param => this.listId = +param.listId);
    this.store.state$
      .takeUntil(this.componentDestroyed)
      .subscribe(user => {
        if (user) {
          this.initializeItem(user);
        }
      }
    );

    const initialItem = { ...this.savedItem };
    initialItem.mapMarker = this.savedItem.mapMarker
      ? { ...this.savedItem.mapMarker }
      : null;
    this.unsavedFactoty.saveTemporaryItem(initialItem, this.savedItem);
  }

  public confirm(): Observable<boolean> | Promise<boolean> | boolean { // Guard function
    if (this.compareObj(this.item, this.savedItem)) {
      return true;
    }

    const message = 'Are your sure that you want to close form';

    return this.modal.open(message);
  }

  public wasChanges(): boolean {
    return !this.compareObj(this.item, this.savedItem) && this.titleIsCorrect();
  }

  private initializeItem(user: User): void {
    const list = user.lists.find(l => l.id === this.listId);
    const item = list.items.find(i => i.id === this.itemId);

    this.savedItem = item;
    this.item = { ...item };
    this.item.mapMarker = item.mapMarker
      ? { ... item.mapMarker }
      : null;

    const date = this.savedItem.dueDate
      ? this.savedItem.dueDate.split('-')
      : '';

    this.dateModel.date.year = this.savedItem.dueDate
      ? +date[0]
      : (new Date()).getFullYear();
    this.dateModel.date.month = this.savedItem.dueDate
      ? +date[1]
      : (new Date()).getMonth() + 1;
    this.dateModel.date.day = this.savedItem.dueDate
      ? +date[2]
      : (new Date()).getDate();

    if (!this.item.dueDate) {
      this.item.dueDate = `${this.dateModel.date.year}-${this.dateModel.date.month}-${this.dateModel.date.day}`;
    }
  }

  private isEmpty(obj: Object): boolean {
    return obj && !!Object.keys(obj).length;
  }

  private saveProps(firstElement: Item, secondElement: Item) {
    firstElement.completed = secondElement.completed;
    firstElement.description = secondElement.description;
    firstElement.dueDate = secondElement.dueDate;
    firstElement.mapMarker = secondElement.mapMarker
      ? { ...secondElement.mapMarker }
      : null;
    firstElement.title = secondElement.title;
    firstElement.id = secondElement.id;
  }

  private compareObj(firstElement: any, secondElement: any): boolean {
    const result = Object.keys(firstElement).map(key => {
      if (firstElement[key] && typeof firstElement[key] === 'object') {
        return this.compareObj(firstElement[key], secondElement[key]);
      } else {
        return secondElement && firstElement[key] === secondElement[key] || key === 'id' ? true : false;
      }
    });
    return result.every(res => res);
  }
}
