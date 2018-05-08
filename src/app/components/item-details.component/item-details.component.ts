import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '../../services/store.service';
import { Item } from '../../models/item.model';
import { Base } from '../base.component';
import { List } from '../../models/list.model';

@Component({
  selector: 'item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetails extends Base implements OnInit, OnDestroy {

  public item: Item;
  public subscriptionToItem: Subscription;
  public subscriptionToList: Subscription;
  private listId: number;
  private itemId: number;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
  ) { super(); }

  private findItem(lists: List[], listId: number, itemId: number): void {
    const list = lists.find(list => list.id === listId);
    this.item = list.items.find(item => item.id === itemId);
  }

  public openEditForm(): void {
    this.router.navigate([`lists/${this.listId}/${this.itemId}/details/edit-form`]);
  }

  ngOnInit() {
    this.subscriptionToList = this.route.parent.params.subscribe(params => this.listId = +params.listId );
    this.subscriptionToItem = this.route.params.subscribe(params => {
      this.itemId = +params.itemId;
      this.store.cast
      .takeUntil(this.destroy)
      .subscribe(user => {
        if (user) {
          this.findItem(user.lists, this.listId, this.itemId);
        }
      });
    });
  }

  ngOnDestroy() {
    this.subscriptionToItem.unsubscribe();
    this.subscriptionToList.unsubscribe();
  }
}