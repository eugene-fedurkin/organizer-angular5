import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export class Base implements OnDestroy {

  protected readonly componentDestroyed: Subject<void> = new Subject<void>();

  public ngOnDestroy(): void {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }
}
