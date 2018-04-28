import { Component } from '@angular/core';
import { Store } from '../../services/store.service';

@Component({
  selector: 'header-app',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class Header {

  public isOpenWindow: boolean = false;
  public get userName(): string {
    return this.store.user ? this.store.user.email : 'Guest';
  }

  constructor(private store: Store) {}

  public toggleWindow(): void {
    this.isOpenWindow = !this.isOpenWindow;
  }
}
