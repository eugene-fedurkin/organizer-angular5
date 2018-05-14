import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IListHttpService } from '../../interfaces/i.list.http';
import { IUserHttpService } from '../../interfaces/i.user.http';
import { ListCreate } from '../../models/list-create.model';
import { List } from '../../models/list.model';
import { LoaderService } from '../../services/loader.service';
import { UnsavedEntitiesFactory } from '../../services/unsaved-entities-factory.service';
import { Store } from '../../services/store.service';
import { Base } from '../base.component';

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
export class ListsComponent extends Base implements OnInit {

  // public title: string = '';
  public lists: List[] = [];

  public constructor(
    private store: Store,
    private userHttp: IUserHttpService,
    private listHttp: IListHttpService,
    private loader: LoaderService,
    private router: Router,
    private unsavedEntitiesFactory: UnsavedEntitiesFactory,
  ) { super(); }

  public addList(title: string): void {
    const listToCreate = new ListCreate();
    listToCreate.title = title;

    const list = this.unsavedEntitiesFactory.createList(listToCreate);
    this.store.saveList(list);

    this.listHttp.createList(listToCreate)
      .takeUntil(this.componentDestroyed)
      .subscribe(createdList => {
        this.store.unblockList(list.id, createdList.id);
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
    this.router.navigate(['lists', id]);
  }

  public ngOnInit(): void {
    this.store.state$
      .takeUntil(this.componentDestroyed)
      .subscribe(user => {
        if (!user && !this.store.action) {
          this.loader.show();
          this.userHttp.getCurrentUserVerbose()
          .takeUntil(this.componentDestroyed)
          .subscribe(u => {
            this.store.saveUser(u);
            this.lists = u.lists;
          },
          error => this.router.navigate(['./auth']),
          () => this.loader.hide());
        } else if (!user && this.store.action === 'remove_user') {
          this.loader.hide(); // TODO: remove?
          this.store.action = null;
        } else {
          this.lists = user.lists;
        }
      });
  }
}
