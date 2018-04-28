import { Component } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('200ms', style({ opacity: 1 })),
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('200ms', style({ opacity: 0 })),
        ]),
      ]
    )
  ],
})
export class Loader {

  public get isVisible(): boolean {
    return this.loader.isVisible;
  }

  constructor(private loader: LoaderService) {}

}