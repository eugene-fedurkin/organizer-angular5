import { Component, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

export class Base {

  protected destroy: Subject<void> = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy.next();
  }
}