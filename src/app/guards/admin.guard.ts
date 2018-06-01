import { Injectable } from '@angular/core';
import { CanLoad, Route  } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AdminGuard implements CanLoad { // not yet used

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    console.log('work');
    return confirm('lets?');
  }
}
