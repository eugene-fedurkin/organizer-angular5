import 'rxjs/add/observable/from';
import 'rxjs/add/operator/delay';

import { Observable } from 'rxjs/Observable';

import { IUserHttpService } from '../interfaces/i.user.http';
import { Credentials } from '../models/credential.model';
import { User } from '../models/user.model';
import { userMock } from './user.mock';

export class MockUserHttpService implements IUserHttpService {

  public registerUser(credential: Credentials): Observable<User> {
    const user = new User(credential.email, []);

    return Observable.from([user]);
  }

  public signIn(credential: Credentials): Observable<any> {
    return Observable.from([null]);
  }

  public getCurrentUserVerbose(): Observable<User> {
    return Observable.from([userMock]).delay(500);
  }

  public signOut(): Observable<any> {
    return Observable.from([null]);
  }
}
