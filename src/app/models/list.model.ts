import { Item } from './item.model';

export class List {
  constructor(
    public id: number,
    public title: string,
    public items: Item[],
  ) {}
}