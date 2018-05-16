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
          const handler = () => {
            const list = user.lists.find(l => l.id === this.listId);
            const index = list.items.findIndex(i => i.id === this.itemId);

            this.factory.removeItem(list.items[index]);

            const subscr = this.itemService.removeItem(this.itemId)
              .finally(() => subscr.unsubscribe())
              .subscribe(
                item => list.items.splice(index, 1),
                err => this.factory.cancelRemove(list.items[index])
              );
            this.closeItem();
          };
          const message = `Are you sure that you want to remove ${this.item.title}`;
          this.modal.open(handler, message);
        }
      });
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
