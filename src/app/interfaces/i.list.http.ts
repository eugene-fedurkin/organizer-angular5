import { Observable } from 'rxjs/Observable';

import { List } from '../models/list.model';
import { ListCreate } from '../models/list-create.model';

export abstract class IListHttpService {
  public abstract createList(list: ListCreate): Observable<List>;
  public abstract removeList(id: number): Observable<List>
  public abstract editList(list: ListCreate, id: number): Observable<List>;
}
