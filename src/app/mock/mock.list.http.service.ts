import { IListHttpService } from '../interfaces/i.list.http';
import { List } from '../models/list.model';
// import { Observable } from 'rxjs/Rx'; // for to get exaption
import { Observable } from 'rxjs/Observable';
import { ListCreate } from '../models/list-create.model';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/delay';

export class MockListHttpService implements IListHttpService {
  private id = 0;
  
  public createList(list: ListCreate): Observable<List> {
    const newList = new List(this.id++, list.title, []);
    return Observable.from([newList]).delay(200);
    // return Observable.interval(2000).map(list => {throw new ErrorObservable('qwe')});
  }
  
  public removeList(id: number): Observable<List> {
    const list = new List(id, 'EXAMPLE', []);
    return Observable.from([list]);
  }

  public editList(list: ListCreate, id: number): Observable<List> {
    const newlist = new List(id, list.title, []);
    return Observable.from([newlist]);
  }
}