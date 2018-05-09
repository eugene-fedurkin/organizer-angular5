import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Router } from '@angular/router';

import { Item as ItemModel } from '../../models/item.model';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent {

  @Input() public item: ItemModel;
  public subscription: Subscription;
  public constructor(private router: Router) {
  }

  public openDetails() {
    this.router.navigate([`lists/${this.item.listId}/${this.item.id}/details`]); // pass through ','
  }

  qwe() {

  }
}
