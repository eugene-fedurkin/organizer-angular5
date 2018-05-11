import { Marker } from './marker.model';


export class Item {
  public constructor(
    public id: number,
    public title: string,
    public description?: string,
    public completed?: boolean,
    public dueDate?: Date,
    public listId?: number,
    public marker?: Marker,
  ) {}
}
