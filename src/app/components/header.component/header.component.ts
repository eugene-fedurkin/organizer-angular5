import { Component, OnInit } from '@angular/core';
import { Store } from '../../services/store.service';

import { Base } from '../base.component';

@Component({
  selector: 'header-app',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends Base implements OnInit {

  public isOpenWindow: boolean = false;
  public userName: string = '';

  public constructor(private store: Store) { super(); }

  public toggleWindow(): void {
    this.isOpenWindow = !this.isOpenWindow;
  }

  ngOnInit() {
    this.store.state$
    .takeUntil(this.componentDestroyed)
    .subscribe(user => {
      if (user) {
        this.userName = user.email;
      }
    });
  }
}
