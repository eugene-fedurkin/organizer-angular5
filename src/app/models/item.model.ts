import { Marker } from './marker.model';


export class Item {
  public constructor(
    public id: number,
    public title: string,
    public description?: string,
    public completed?: boolean,
    public dueDate?: string,
    public listId?: number,
    public mapMarker?: Marker,
  ) {}
}
