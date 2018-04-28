import { Component, Input } from '@angular/core';

import { List as ListModel } from '../../models/list.model';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class List {

  @Input() public list: ListModel;
}