import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../models/user.model';

@Injectable()
export class Store {

  public user: User;
  public cast: BehaviorSubject<User> = new BehaviorSubject<User>(this.user);

  public saveUser(user: User): void {
    if (!this.user) this.user = user;
    this.cast.next(user);
  }
}