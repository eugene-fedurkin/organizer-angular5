import { Item } from './item.model';

export class List {
  public constructor(
    public id: number,
    public title: string,
    public items: Item[],
  ) {}
}
