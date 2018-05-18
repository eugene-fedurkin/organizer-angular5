import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { staggerSetting } from '../../animations/stagget-setting';
import { IUserHttpService } from '../../interfaces/i.user.http';
import { ModalService } from '../../services/modal.service';
import { Store } from '../../services/store.service';
import { Base } from '../base.component';

@Component({
  selector: 'app-setting-window',
  templateUrl: './setting-window.component.html',
  styleUrls: ['./setting-window.component.css'],
  animations: [ staggerSetting() ],
})
export class SettingWindowComponent extends Base {

  @Input() public isOpenWindow;
  @Output() public close = new EventEmitter();
  public options: string[] = ['Profile', 'Setting', 'Sign out'];

  public constructor(
    private modal: ModalService,
    private router: Router,
    private http: IUserHttpService,
    private store: Store,
  ) { super(); }

  public openProfile(): void {
    // TODO: open profile
    this.close.emit();
    console.log('openProfile');
  }

  public openSetting(): void {
    // TODO: open setting
    this.close.emit();
    console.log('openSetting');
  }

  public confirmSignOut(): void {
    this.closeWindow();
    const message = 'Are you sure that you want to sign out?';

    const sub = this.modal.open(message)
      .subscribe(result => {
        if (result) {
          this.handler();
        }
        sub.unsubscribe();
    });
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

  public closeWindow(): void {
    this.close.emit();
  }
}
