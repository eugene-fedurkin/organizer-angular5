import { Injectable } from '@angular/core';

import { ListCreate } from '../models/list-create.model';
import { List } from '../models/list.model';
import { Store } from './store.service';
import { ItemCreate } from '../models/item-create';
import { Item } from '../models/item.model';

@Injectable()
export class Queue { // TODO rename

  private listId: number = 0;
  private itemId: number = 0;

  constructor(private store: Store) {}

  public saveList(listToCreate: ListCreate): List {
    const list = new List(--this.listId, listToCreate.title, null);
    this.store.saveList(list);

    return list;
  }

  public saveItem(itemCreate: ItemCreate): Item {
    const item = new Item(--this.itemId, itemCreate.title);
    item.listId = itemCreate.listId;

    this.store.saveItem(item);

    return item;
  }
}
