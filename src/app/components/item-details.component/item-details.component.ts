import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '../../services/store.service';
import { Item } from '../../models/item.model';
import { Base } from '../base.component';
import { List } from '../../models/list.model';
import { User } from '../../models/user.model';
import { ModalService } from '../../services/modal.service';
import { takeUntil } from 'rxjs/operator/takeUntil';
import { IItemHttpService } from '../../interfaces/i.item.http';
import { UnsavedEntitiesFactory } from '../../services/unsaved-entities-factory.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent extends Base implements OnInit {

  public item: Item;
  private listId: number;
  private itemId: number;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly router: Router,
    private readonly modal: ModalService,
    private readonly itemService: IItemHttpService,
    private readonly factory: UnsavedEntitiesFactory,
    private readonly notify: NotificationService,
  ) { super(); }

  private findItem(lists: List[], listId: number, itemId: number): void {
    const list = lists.find(l => l.id === listId);
    this.item = list.items.find(item => item.id === itemId);
  }

  public openEditForm(): void {
    this.router.navigate(['lists', this.listId, this.itemId, 'details', 'edit-form']);
  }

  private closeItem(): void {
    this.router.navigate(['lists', this.listId]);
  }

  public deleteItem(): void {
    this.store.state$
      .takeUntil(this.componentDestroyed)
      .subscribe(user => {
        if (user) {
          const message = `Are you sure that you want to remove ${this.item.title}`;
          const sub = this.modal.open(message)
            .subscribe(result => {
              if (result) {
                this.handler(user);
              }
              sub.unsubscribe();
          });
        }
      });
  }

  private handler(user): void {
      const list = user.lists.find(l => l.id === this.listId);
      const index = list.items.findIndex(i => i.id === this.itemId);

      this.factory.removeItem(list.items[index]);

      const subscr = this.itemService.removeItem(this.itemId)
        .finally(() => subscr.unsubscribe())
        .subscribe(
          item => {
            list.items.splice(index, 1);
            this.notify.addNotification('The item has been removed');
          },
          err => {
            this.factory.cancelRemove(list.items[index]);
            this.notify.addNotification('An error occurred while deleting the item');
          }
        );
      this.closeItem();
  }

  ngOnInit() {
    this.route.parent.params
      .subscribe(params => this.listId = +params.listId );
    this.route.params
      .subscribe(params => {
        this.itemId = +params.itemId;
        this.store.state$
        .takeUntil(this.componentDestroyed)
        .subscribe(user => {
          if (user) {
            this.findItem(user.lists, this.listId, this.itemId);
          }
        });
      });
  }
}
