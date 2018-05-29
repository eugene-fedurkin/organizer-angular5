import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Item } from '../models/item.model';
import { List } from '../models/list.model';
import { User } from '../models/user.model';
import { CapitalizePipe } from '../pipes/capitilize.pipe';

@Injectable()
export class Store {

  private user: User;
  public userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(this.user);
  public get state$(): Observable<User> {
    return this.userSubject.asObservable();
  }
  public action: string = ''; // TODO: remove

  public saveUser(user: User): void {
    if (!this.user) this.user = user;
    this.userSubject.next(this.user);
  }

  public removeUser(): void {
    this.user = null;
    this.action = 'remove_user';
    this.userSubject.next(this.user);
  }

  public saveList(list: List): void {
    if (!this.user.lists) this.user.lists = [];

    this.user.lists.push(list);
    this.userSubject.next(this.user);
  }

  public unblockList(currentListId: number, listId): void {
    const list = this.user.lists.find(l => l.id === currentListId);

    list.id = listId;
    this.userSubject.next(this.user);
  }

  public removeList(id: number): void {
    const index = this.user.lists.findIndex(list => list.id === id);

    this.user.lists.splice(index, 1);
  }

  public editList(title: string, id: number): void {
    const list = this.user.lists.find(l => l.id === id);
    list.title = new CapitalizePipe().transform(title);

    this.userSubject.next(this.user);
  }

  public saveItem(item: Item): void {
    const list = this.user.lists.find(l => l.id === item.listId);

    if (!list.items) list.items = [];

    list.items.push(item);
    this.userSubject.next(this.user);
  }

  public updateItem(item: Item, itemIdToUnblock?: number): void {
    const list = this.user.lists.find(l => l.id === item.listId);
    const currentItem = itemIdToUnblock
      ? list.items.find(i => i.id === itemIdToUnblock)
      : list.items.find(i => i.id === item.id);

    currentItem.id = item.id;
    currentItem.title = item.title;
    currentItem.dueDate = item.dueDate;
    currentItem.description = item.description;
    currentItem.completed = item.completed;

    this.userSubject.next(this.user);
  }
}
