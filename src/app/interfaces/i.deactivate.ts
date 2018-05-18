import { Observable } from 'rxjs/observable';

export interface CanComponentDeactivate {
  confirm(): Observable<boolean> | Promise<boolean> | boolean;
}
