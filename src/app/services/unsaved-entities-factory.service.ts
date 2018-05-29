import { Injectable } from '@angular/core';

import { ItemCreated } from '../models/item-create';
import { Item } from '../models/item.model';
import { ListCreate } from '../models/list-create.model';
import { List } from '../models/list.model';
import { TemporaryIdInfo } from '../models/temporary-id-info.model';

@Injectable()
export class UnsavedEntitiesFactory {

  private listId: number = 0;
  private itemId: number = 0;
  private itemIdToRemove: TemporaryIdInfo[] = [];
  private storeToItemUpdate: { initialItem: Item, unsavedItem: Item }[] = [];

  public createList(listToCreate: ListCreate): List {
    const list = new List(--this.listId, listToCreate.title, null);

    return list;
  }

  public createItem(item: Item): Item {
    const newItem = { ...item, id: --this.itemId, title: item.title };
    newItem.mapMarker = item.mapMarker
      ? { ...item.mapMarker }
      : null;

    return newItem;
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

  public saveTemporaryItem(initialItem: Item, unsavedItem: Item): void {
    this.storeToItemUpdate.push({ initialItem, unsavedItem });
  }

  public getCurrentItem(id: number): Item {
    const itemInfo = this.storeToItemUpdate.find(i => i.unsavedItem.id === id);

    return itemInfo.initialItem;
  }

  public removeTemporaryItem(unsavedId: number) {
    const index = this.storeToItemUpdate.findIndex(i => i.unsavedItem.id === unsavedId);

    this.storeToItemUpdate.splice(index, 1);
  }
}
