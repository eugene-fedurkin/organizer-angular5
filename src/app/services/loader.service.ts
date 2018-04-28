import { Injectable } from '@angular/core';

@Injectable()
export class LoaderService {

  private countToShow: number = 0;

  public get isVisible(): boolean {
    return !!this.countToShow;
  }

  public show(): void {
    this.countToShow++;
  }

  public hide(): void {
    if (this.countToShow) this.countToShow--;
  }
}