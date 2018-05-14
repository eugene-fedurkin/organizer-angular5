import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '../../services/store.service';
import { Base } from '../base.component';
import { List } from '../../models/list.model';
import { Item } from '../../models/item.model';
import { UnsavedEntitiesFactory } from '../../services/unsaved-entities-factory.service';
import { ItemCreate } from '../../models/item-create';
import { IItemHttpService } from '../../interfaces/i.item.http';


@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent extends Base implements OnInit, OnDestroy {

  public subscription: Subscription;
  public list: List;

  public constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private queue: UnsavedEntitiesFactory,
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
    const item = this.queue.createItem(itemCreate);
    this.store.saveItem(item);

    this.http.createItem(itemCreate)
    .takeUntil(this.componentDestroyed)
    .subscribe(newItem => this.store.updateItem(newItem, item.id));
  }

  ngOnInit() {
    this.store.state$
    .takeUntil(this.componentDestroyed)
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
