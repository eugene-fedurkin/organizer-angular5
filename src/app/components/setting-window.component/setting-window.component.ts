import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';

import { Router } from '@angular/router';

import { ModalService } from '../../services/modal.service';
import { IUserHttpService } from '../../interfaces/i.user.http';
import { Base } from '../base.component';
import { Store } from '../../services/store.service';
import { User } from '../../models/user.model';

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
export class SettingWindow extends Base {

  @Input() public isOpenWindow;
  @Output() public close = new EventEmitter();
  public options: string[] = ['Profile', 'Setting', 'Sign out'];

  constructor(
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
        .takeUntil(this.destroy)
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
