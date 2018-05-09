import { Injectable } from '@angular/core';

@Injectable()
export class LoaderService {

  private showCounter: number = 0;

  public get isVisible(): boolean {
    return !!this.showCounter;
  }

  public show(): void {
    this.showCounter++;
  }

  public hide(): void {
    if (this.showCounter) this.showCounter--;
  }
}
