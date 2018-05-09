import { List } from './list.model';

export class User {
  public constructor(public email: string, public lists: List[]) {}
}