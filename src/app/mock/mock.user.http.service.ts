import 'rxjs/add/observable/from';
import 'rxjs/add/operator/delay';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { IUserHttpService } from '../interfaces/i.user.http';
import { Credentials } from '../models/credential.model';
import { User } from '../models/user.model';
import { userMock } from './user.mock';

export class MockUserHttpService implements IUserHttpService {

  private isSignIn: boolean = true;

  public registerUser(credential: Credentials): Observable<User> {
    const user = new User(credential.email, []);

    return Observable.from([user]);
  }

  public signIn(credential: Credentials): Observable<any> {
    this.isSignIn = true;
    return Observable.from([null]);
  }

  public getCurrentUserVerbose(): Observable<User> {
    if (this.isSignIn) return Observable.from([userMock]).delay(500);
    return Observable.interval(2000).map(resp => { throw new ErrorObservable('401 unauthorized'); });
  }

  public signOut(): Observable<any> {
    this.isSignIn = false;
    return Observable.from([null]);
  }
}
