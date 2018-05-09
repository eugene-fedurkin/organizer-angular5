import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { IUserHttpService } from '../../interfaces/i.user.http';
import { ModalService } from '../../services/modal.service';
import { Store } from '../../services/store.service';
import { Base } from '../base.component';

@Component({
  selector: 'setting-window',
  templateUrl: './setting-window.component.html',
  styleUrls: ['./setting-window.component.css'],
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        query('li', style({ transform: 'translateX(100px)', opacity: 0 })),
        query('li', stagger('150ms', [
          animate('200ms', style({ transform: 'translateX(0px)', opacity: 1 }))
        ])),
      ]),
      transition(':leave', [
        query('li', style({ transform: 'translateX(0px)', opacity: 1 })),
        query('li', stagger('75ms', [
          animate('200ms', style({ transform: 'translateX(100px)', opacity: 0 }))
        ])),
      ]),
    ])
  ]
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
    const handler = () => {
      this.http.signOut()
        .takeUntil(this.componentDestroyed)
        .subscribe(resp => {
          this.store.removeUser();
          this.router.navigate(['./auth']);
        },
      error => console.log('Server isnt access right now'));
    };
    const message = 'Are you sure that you want to sign out?';

    this.modal.open(handler, message);
  }

  public closeWindow(): void {
    this.close.emit();
  }
}
