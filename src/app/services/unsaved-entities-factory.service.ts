import { Injectable } from '@angular/core';

import { ItemCreate } from '../models/item-create';
import { Item } from '../models/item.model';
import { ListCreate } from '../models/list-create.model';
import { List } from '../models/list.model';
import { TemporaryIdInfo } from '../models/temporary-id-info.model';

@Injectable()
export class UnsavedEntitiesFactory {

  private listId: number = 0;
  private itemId: number = 0;
  private itemIdToRemove: TemporaryIdInfo[] = [];

  public createList(listToCreate: ListCreate): List {
    const list = new List(--this.listId, listToCreate.title, null);

    return list;
  }

  public createItem(itemCreate: ItemCreate): Item {
    const item = new Item(--this.itemId, itemCreate.title);
    item.listId = itemCreate.listId;

    return item;
  }

  public removeItem(item: Item): Item {
    const temporaryIdInfo = new TemporaryIdInfo(item.id, --this.itemId);

    this.itemIdToRemove.push(temporaryIdInfo);
    item.id = this.itemId;
    return item;
  }

  public cancelRemove(item: Item): void {
    const index = this.itemIdToRemove.findIndex(info => info.temporaryId === item.id);
    item.id = this.itemIdToRemove[index].actualId;

    this.itemIdToRemove.splice(index, 1);
  }
}
