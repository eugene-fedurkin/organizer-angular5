import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../models/user.model';
import { List } from '../models/list.model';
import { Item } from '../models/item.model';

@Injectable()
export class Store {

  public coords = {lat: 53.9045, lng: 27.5615}
  private user: User;
  public cast: BehaviorSubject<User> = new BehaviorSubject<User>(this.user);
  public actoin: string = '';

  public saveUser(user: User): void {
    if (!this.user) this.user = user;
    this.cast.next(this.user);
  }

  public removeUser(): void {
    this.user = null;
    this.actoin = 'remove_user';
    this.cast.next(this.user);
  }

  public saveList(list: List): void {
    this.user.lists.push(list);
    this.cast.next(this.user);
  }

  public unblockList(currentListId: number, listId): void {
    const list = this.user.lists.find(list => list.id === currentListId);

    list.id = listId;
    this.cast.next(this.user);
  }

  public removeList(id: number): void {
    const index = this.user.lists.findIndex(list => list.id === id);

    this.user.lists.splice(index, 1);
  }

  public editList(title: string, id: number): void {
    const list = this.user.lists.find(list => list.id === id);
    list.title = title;

    this.cast.next(this.user);
  }

  public saveItem(item: Item): void {
    const list = this.user.lists.find(list => list.id === item.listId);

    list.items.push(item);
    this.cast.next(this.user);
  }

  public updateItem(item: Item, itemIdToUnblock?: number): void {
    const list = this.user.lists.find(list => list.id === item.listId);
    const currentItem = itemIdToUnblock
      ? list.items.find(currentItem => currentItem.id === itemIdToUnblock)
      : list.items.find(currentItem => currentItem.id === item.id);

    currentItem.id = item.id;
    currentItem.title = item.title;
    currentItem.dueDate = item.dueDate;
    currentItem.description = item.description;
    currentItem.completed = item.completed;

    this.cast.next(this.user);
  }
}
