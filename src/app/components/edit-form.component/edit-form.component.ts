import 'snazzy-info-window/dist/snazzy-info-window.min.css';

import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMyDateModel, IMyDpOptions } from 'mydatepicker';
import { Observable } from 'rxjs/Observable';

import { bounceTop } from '../../animations/bounce-edit-form';
import { CanComponentDeactivate } from '../../interfaces/i.deactivate';
import { IItemHttpService } from '../../interfaces/i.item.http';
import { Item } from '../../models/item.model';
import { User } from '../../models/user.model';
import { ModalService } from '../../services/modal.service';
import { NotificationService } from '../../services/notification.service';
import { Store } from '../../services/store.service';
import { Base } from '../base.component';
import { Marker } from '../../models/marker.model';

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
  ) { super(); }

  public saveChanges(): void {
    // if (this.isEmpty(this.item.mapMarker)) this.item.mapMarker = null;

    const subscr = this.http.updateItem(this.item)
      .finally(() => subscr.unsubscribe())
      .subscribe(item => {
        this.savedItem.completed = this.item.completed;
        this.savedItem.description = this.item.description;
        this.savedItem.dueDate = this.item.dueDate;
        this.savedItem.mapMarker = this.item.mapMarker;
        this.savedItem.title = this.item.title;

        this.closeForm();
      }, error => {
        this.notify.addNotification('Failed to save the item');
      }
    );
  }

  public closeForm(): void {
    this.router.navigate(['lists', this.listId, this.itemId, 'details']);
  }

  private initializeItem(user: User): void {
    const list = user.lists.find(l => l.id === this.listId);
    const item = list.items.find(i => i.id === this.itemId);

    this.savedItem = item;
    this.item = {
      ...item,
      mapMarker: { ...item.mapMarker },
    };

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

  public dateChanges(event: IMyDateModel): void {
    this.dateModel.date.year = event.date.year;
    this.dateModel.date.month = event.date.month;
    this.dateModel.date.day = event.date.day;

    if (!event.date.day || !event.date.month || !event.date.month) {
      this.notify.addNotification('Uncorrect date!');
      return;
    }

    this.item.dueDate = `${this.dateModel.date.year}-${this.dateModel.date.month}-${this.dateModel.date.day}`;
  }

  public saveMarkerData(marker: Marker): void {
    this.item.mapMarker = marker;
  }

  private isEmpty(obj: Object): boolean {
    return obj && !!Object.keys(obj).length;
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
  }

  public confirm(): Observable<boolean> | Promise<boolean> | boolean { // Guard function
    if (JSON.stringify(this.item) === JSON.stringify(this.savedItem)) {
      return true;
    }

    const message = 'Are your sure that you want to close form';

    return this.modal.open(message);
  }
}
