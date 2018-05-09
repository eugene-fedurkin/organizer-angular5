import { Injectable } from '@angular/core';

import { ItemCreate } from '../models/item-create';
import { Item } from '../models/item.model';
import { ListCreate } from '../models/list-create.model';
import { List } from '../models/list.model';

@Injectable()
export class UnsavedEntitiesFactory {

  private listId: number = 0;
  private itemId: number = 0;

  public createList(listToCreate: ListCreate): List {
    const list = new List(--this.listId, listToCreate.title, null);

    return list;
  }

  public createItem(itemCreate: ItemCreate): Item {
    const item = new Item(--this.itemId, itemCreate.title);
    item.listId = itemCreate.listId;

    return item;
  }
}
