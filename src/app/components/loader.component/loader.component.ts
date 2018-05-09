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
        transition(':leave', [
          style({ opacity: 1 }),
          animate('200ms', style({ opacity: 0 })),
        ]),
      ]
    )
  ],
})
export class LoaderComponent {

  public get isVisible(): boolean {
    return this.loader.isVisible;
  }

  public constructor(private loader: LoaderService) {}

}