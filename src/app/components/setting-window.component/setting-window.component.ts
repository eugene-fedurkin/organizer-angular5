import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingWindowComponent {

  @Input() public isOpenWindow;
  @Output() public close = new EventEmitter();
  @Output() public confirmSignOut = new EventEmitter();
  @Output() public openSitting = new EventEmitter();
  public options: string[] = ['Profile', 'Setting', 'Sign out'];

  public openProfile(): void {
    // TODO: open profile
    this.close.emit();
    console.log('openProfile');
  }

  public onOpenSetting(): void {
    // TODO: open setting
    this.close.emit();
    this.openSitting.emit();
    console.log('openSetting');
  }

  public onConfirmSignOut(): void {
    this.closeWindow();
    this.confirmSignOut.emit();
  }

  public closeWindow(): void {
    this.close.emit();
  }
}
