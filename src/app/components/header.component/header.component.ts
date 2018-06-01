import { Component, OnInit } from '@angular/core';
import { Store } from '../../services/store.service';

import { Base } from '../base.component';
import { ModalService } from '../../services/modal.service';
import { Router } from '@angular/router';
import { IUserHttpService } from '../../interfaces/i.user.http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends Base implements OnInit {

  public isOpenWindow: boolean = false;
  public userName: string = '';

  public constructor(
    private modal: ModalService,
    private router: Router,
    private http: IUserHttpService,
    private store: Store,
  ) { super(); }

  public toggleWindow(): void {
    this.isOpenWindow = !this.isOpenWindow;
  }

  public confirmSignOut(): void {
    const message = 'Are you sure that you want to sign out?';

    const sub = this.modal.open(message)
      .subscribe(result => {
        if (result) {
          this.handler();
        }
        sub.unsubscribe();
    });
  }

  public openSetting(): void {
    this.router.navigate(['setting']);
  }

  private handler(): void {
    this.http.signOut()
      .takeUntil(this.componentDestroyed)
      .subscribe(resp => {
        this.store.removeUser();
        this.router.navigate(['./auth']);
      },
    error => console.log('Server isnt access right now'));
  }

  ngOnInit() {
    this.store.state$
    .takeUntil(this.componentDestroyed)
    .subscribe(user => {
      if (user) {
        this.userName = user.email;
      } else {
        this.userName = '';
      }
    });
  }
}
