import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IItemHttpService } from '../interfaces/i.item.http';

import { HttpClient } from '@angular/common/http';
import { ItemCreate } from '../models/item-create';
import { Item } from '../models/item.model';
import 'rxjs/add/operator/delay';

export class MockItemHttpService implements IItemHttpService {

  private id = 0;
  
  public createItem(itemCreate: ItemCreate): Observable<Item> {
    const item = new Item(this.id++, itemCreate.title);
    item.listId = itemCreate.listId;

    return Observable.from([item]).delay(2000);
  }
}