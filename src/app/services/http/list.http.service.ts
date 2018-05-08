import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IListHttpService } from '../../interfaces/i.list.http';

import { HttpClient } from '@angular/common/http';
import { List } from '../../models/list.model';
import { ListCreate } from '../../models/list-create.model';

@Injectable()
export class ListHttpService implements IListHttpService {

  private readonly url = 'https://organizerapi.azurewebsites.net';
  private readonly options = { // TODO: RequestOption is doesnt work
    withCredentials: true
  };
  
  constructor(private http: HttpClient) {}
  
  public createList(list: ListCreate): Observable<List> {
    return this.http.post<List>(`${this.url}/lists`, list, this.options);
  }
  
  public removeList(id: number): Observable<List> {
    return this.http.delete<List>(`${this.url}/lists/${id}`, this.options);
  }

  public editList(list: ListCreate, id: number): Observable<List> {
    return this.http.put<List>(`${this.url}/lists/${id}`, list, this.options);
  }
}