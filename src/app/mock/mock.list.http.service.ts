import { IListHttpService } from '../interfaces/i.list.http';
import { List } from '../models/list.model';
import { Observable } from 'rxjs/Observable';
import { ListCreate } from '../models/list-create.model';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/delay';

export class MockListHttpService implements IListHttpService {
  private id = 2000;

  public createList(list: ListCreate): Observable<List> {
    const newList = new List(this.id++, list.title, []);
    if (Math.random() > 0.1) {
      return Observable.from([newList]).delay(2000);
    } else {
      return Observable.interval(2000).map(resp => { throw new ErrorObservable('Error'); });
    }
  }

  public removeList(id: number): Observable<List> {
    const list = new List(id, 'EXAMPLE', []);
    return Observable.from([list]);
  }

  public editList(list: ListCreate, id: number): Observable<List> {
    const newlist = new List(id, list.title, []);
    return Observable.from([newlist]).delay(0);
  }
}
