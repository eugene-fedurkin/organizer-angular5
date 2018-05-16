import { Component, Input, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Router } from '@angular/router';

import { Item as ItemModel } from '../../models/item.model';

import { fadeItem } from '../../animations/fade-item';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  animations: [ fadeItem() ],
})
export class ItemComponent {

  @HostBinding('@fadeItem') private animateItem;
  @Input() public item: ItemModel;
  public subscription: Subscription;
  public constructor(private router: Router) {
  }

  public openDetails() {
    this.router.navigate(['lists', this.item.listId, this.item.id, 'details']);
  }
}
