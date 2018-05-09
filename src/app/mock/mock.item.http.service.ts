import 'rxjs/add/operator/delay';

import { Observable } from 'rxjs/Observable';

import { IItemHttpService } from '../interfaces/i.item.http';
import { ItemCreate } from '../models/item-create';
import { Item } from '../models/item.model';

export class MockItemHttpService implements IItemHttpService {

  private id: number = 0;

  public createItem(itemCreate: ItemCreate): Observable<Item> {
    const item = new Item(this.id++, itemCreate.title);
    item.listId = itemCreate.listId;

    return Observable.from([item]).delay(2000);
  }
}
