import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

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

  public removeItem(): Observable<Item> {
    const item = new Item(this.id++, `Mock Item ${this.id}`);

    const chance = Math.random();
    if (chance < 0.1) {
      return Observable.interval(2000).map(list => { throw new ErrorObservable('Error'); });
    } else {
      return Observable.from([item]).delay(2000);
    }
  }

  public updateItem(item: Item): Observable<Item> {
    return Observable.from([item]).delay(2000);
  }
}
