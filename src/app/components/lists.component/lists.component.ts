import { Component, OnInit } from '@angular/core';

import { trigger, style, animate, transition } from '@angular/animations';

import { Store } from '../../services/store.service';

import { List } from '../../models/list.model';
import { Base } from '../base.component';

import { IListHttpService } from '../../interfaces/i.list.http';
import { IUserHttpService } from '../../interfaces/i.user.http';
import { LoaderService } from '../../services/loader.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operator/takeUntil';
import { ListCreate } from '../../models/list-create.model';
import { Queue } from '../../services/queue.service';

@Component({
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1, transform: 'translateX(0)' }),
        animate('300ms', style({ opacity: 0, transform: 'translateX(-150px)' }))
      ])
    ])
  ]
})
export class Lists extends Base {

  // public title: string = '';
  public lists: List[] = [];

  constructor(
    private store: Store,
    private userHttp: IUserHttpService,
    private listHttp: IListHttpService,
    private loader: LoaderService,
    private router: Router,
    private queue: Queue,
  ) { super(); }

  public addList(title: string): void {
    const listToCreate = new ListCreate();
    listToCreate.title = title;

    const list = this.queue.saveList(listToCreate);

    this.listHttp.createList(listToCreate)
    .subscribe(newList => {
      this.store.unblockList(list.id, newList.id)
      console.log('Notification to save list');
    },
    error => {
      this.store.removeList(list.id);
      console.log('Notification of fail to save');
    });
  }

  public removeList(id: number): void {
    this.store.removeList(id);
  }

  public editList(list: List): void {
    this.store.editList(list.title, list.id);
  }

  public openList(id: number) {
    this.router.navigate([`/lists/${id}`]);
  }

  ngOnInit(): void {
    this.store.cast
      .takeUntil(this.destroy)
      .subscribe(user => {
        if (!user && !this.store.actoin) {
          this.loader.show();
          this.userHttp.getCurrentUserVerbose()
          .takeUntil(this.destroy)
          .subscribe(user => {
            this.store.saveUser(user);
            this.lists = user.lists;
            this.loader.hide();
          }, error => {
            this.router.navigate(['./auth']);
            this.loader.hide();
          })
        } else if (!user && this.store.actoin === 'remove_user') {
          this.loader.hide();
          this.store.actoin = null;
        } else {
          this.lists = user.lists;
        }
      });
  }
}
