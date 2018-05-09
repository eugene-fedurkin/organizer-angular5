import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IListHttpService } from '../../interfaces/i.list.http';
import { ListCreate } from '../../models/list-create.model';
import { List } from '../../models/list.model';

@Injectable()
export class ListHttpService implements IListHttpService {

  private readonly listsUrl = 'https://organizerapi.azurewebsites.net/lists';
  private readonly options = {
    withCredentials: true
  };

  public constructor(private readonly http: HttpClient) {}

  public createList(list: ListCreate): Observable<List> {
    return this.http.post<List>(this.listsUrl, list, this.options);
  }

  public removeList(id: number): Observable<List> {
    return this.http.delete<List>(`${this.listsUrl}/${id}`, this.options);
  }

  public editList(list: ListCreate, id: number): Observable<List> {
    return this.http.put<List>(`${this.listsUrl}/${id}`, list, this.options);
  }
}
