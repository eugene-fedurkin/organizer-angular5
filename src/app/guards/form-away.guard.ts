import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { CanComponentDeactivate } from '../interfaces/i.deactivate';
import { Observable } from 'rxjs/observable';

@Injectable()
export class FormAwayGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    return component.confirm();
  }
}
