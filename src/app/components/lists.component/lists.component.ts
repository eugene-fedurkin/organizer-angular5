import { Component, OnInit } from '@angular/core';

import { Store } from '../../services/store.service';

import { List } from '../../models/list.model';
import { Base } from '../base.component';

import { IUserHttpService } from '../../interfaces/i.user.http';
import { LoaderService } from '../../services/loader.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class Lists extends Base {

  public title: string = '';
  public get lists(): List[] {
    return this.store.user ? this.store.user.lists : [];
  }

  constructor(
    private store: Store,
    private http: IUserHttpService,
    private loader: LoaderService,
    private router: Router,
  ) { super(); }

  public clear(): void {
    this.title = '';
  }

  public addList(): void {
    // TODO: update
  }

  ngOnInit(): void {
    if (!this.store.user) {
      this.loader.show();
      this.http.getCurrentUserVerbose()
      .takeUntil(this.destroy)
      .subscribe(user => {
        this.store.user = user;
        this.loader.hide();
      },
      error => {
        this.router.navigate(['./auth']);
        this.loader.hide();
        // TODO: add float massage
      });
    }
  }
}
