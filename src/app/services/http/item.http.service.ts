import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


import { HttpClient } from '@angular/common/http';
import { IItemHttpService } from '../../interfaces/i.item.http';
import { ItemCreate } from '../../models/item-create';
import { Item } from '../../models/item.model';

@Injectable()
export class ItemHttpService implements IItemHttpService {

  private readonly url = 'https://organizerapi.azurewebsites.net';
  private readonly options = { // TODO: RequestOption is doesnt work
    withCredentials: true
  };
  
  constructor(private http: HttpClient) {}
  
  public createItem(item: ItemCreate): Observable<Item> {
    return this.http.post<Item>(`${this.url}/items`, item, this.options);
  }
}