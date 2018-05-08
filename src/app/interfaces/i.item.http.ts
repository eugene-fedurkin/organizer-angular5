import { Observable } from 'rxjs/Observable';

import { ItemCreate } from '../models/item-create';
import { Item } from '../models/item.model';

export abstract class IItemHttpService {
  public abstract createItem(item: ItemCreate): Observable<Item>;
}
