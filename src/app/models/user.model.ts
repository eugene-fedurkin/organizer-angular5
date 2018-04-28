import { List } from './list.model';

export class User {
  constructor(public email: string, public lists: List[]) {}
}