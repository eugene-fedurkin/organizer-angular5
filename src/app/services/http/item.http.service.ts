import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IItemHttpService } from '../../interfaces/i.item.http';
import { ItemCreate } from '../../models/item-create';
import { Item } from '../../models/item.model';

@Injectable()
export class ItemHttpService implements IItemHttpService {

  private readonly url = 'https://organizerapi.azurewebsites.net/items';
  private readonly options = {
    withCredentials: true
  };

  public constructor(private readonly http: HttpClient) {}

  public createItem(item: ItemCreate): Observable<Item> {
    return this.http.post<Item>(this.url, item, this.options);
  }

  public removeItem(id: number): Observable<Item> {
    return this.http.delete<Item>(`${this.url}/${id}`, this.options);
  }

  public updateItem(item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.url}/${item.id}`, item, this.options);
  }
}
