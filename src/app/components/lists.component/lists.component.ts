import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { fadeList } from '../../animations/fade-list';
import { IItemHttpService } from '../../interfaces/i.item.http';
import { IListHttpService } from '../../interfaces/i.list.http';
import { IUserHttpService } from '../../interfaces/i.user.http';
import { Item } from '../../models/item.model';
import { ListCreate } from '../../models/list-create.model';
import { List } from '../../models/list.model';
import { CapitalizePipe } from '../../pipes/capitilize.pipe';
import { LoaderService } from '../../services/loader.service';
import { Store } from '../../services/store.service';
import { UnsavedEntitiesFactory } from '../../services/unsaved-entities-factory.service';
import { Base } from '../base.component';
import { takeUntil } from 'rxjs/operator/takeUntil';
import { ItemCreated } from '../../models/item-create';

@Component({
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
  animations: [ fadeList() ],
})
export class ListsComponent extends Base implements OnInit {

  public lists: List[] = [];

  public constructor(
    private readonly store: Store,
    private readonly userHttp: IUserHttpService,
    private readonly listHttp: IListHttpService,
    private readonly itemHttp: IItemHttpService,
    private readonly loader: LoaderService,
    private readonly router: Router,
    private readonly unsavedEntitiesFactory: UnsavedEntitiesFactory,
  ) { super(); }

  public addList(title: string): void {
    const listToCreate = new ListCreate();
    listToCreate.title = title;

    const list = this.unsavedEntitiesFactory.createList(listToCreate);
    list.title = new CapitalizePipe().transform(list.title);

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

  public changeListToItem(dropData: {item: Item, droppableListId: number}): void {

    const draggbleListId = dropData.item.listId;
    dropData.item.listId = dropData.droppableListId;

    const tempItemDroppable = this.unsavedEntitiesFactory.createItem(dropData.item);

    this.itemHttp.updateItem(dropData.item)
      .takeUntil(this.componentDestroyed)
      .subscribe(item => {
        this.unsavedEntitiesFactory.removeTemporaryItem(tempItemDroppable.id);
        tempItemDroppable.id = item.id;

        const index = prevList.items.findIndex(i => i.id === dropData.item.id);
        prevList.items.splice(index, 1);
      },
      error => {
        const indexDroppable = nextList.items.findIndex(i => i === tempItemDroppable);
        const item = this.unsavedEntitiesFactory.cancelRemove(tempItemDraggable);

        nextList.items.splice(indexDroppable, 1);
      });

    const tempItemDraggable = this.unsavedEntitiesFactory.removeItem(dropData.item);

    const prevList = this.lists.find(l => l.id === draggbleListId);
    const nextList = this.lists.find(l => l.id === dropData.droppableListId);

    nextList.items.push(tempItemDroppable);
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
