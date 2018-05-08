import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '../../services/store.service';
import { Base } from '../base.component';
import { List } from '../../models/list.model';
import { Item } from '../../models/item.model';
import { Queue } from '../../services/queue.service';
import { ItemCreate } from '../../models/item-create';
import { IItemHttpService } from '../../interfaces/i.item.http';


@Component({
  selector: 'items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class Items extends Base implements OnInit, OnDestroy {

  public subscription: Subscription;
  public list: List;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private queue: Queue,
    private http: IItemHttpService
  ) { super(); }

  private initializeItems(lists: List[], id) {
    this.list = lists.find(list => list.id === +id);

    if (!this.list) {
      this.router.navigate(['/lists']);
    }
  }

  public addItem(title: string): void {
    const itemCreate = new ItemCreate(title, this.list.id);
    const item = this.queue.saveItem(itemCreate);

    this.http.createItem(itemCreate)
    .takeUntil(this.destroy)
    .subscribe(newItem => this.store.updateItem(newItem, item.id))
  }

  ngOnInit() {
    this.store.cast
    .takeUntil(this.destroy)
    .subscribe(user => {
      if (user && user.lists.length) {
        this.subscription = this.activatedRoute.params.subscribe(param => this.initializeItems(user.lists, param.listId));
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}