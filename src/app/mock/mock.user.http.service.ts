import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/delay';

import { Credential } from '../models/credential.model';

import { userMock } from './user.mock';

import { IUserHttpService } from '../interfaces/i.user.http';
import { User } from '../models/user.model';

export class MockUserHttpService implements IUserHttpService {

  public registerUser(credential: Credential): Observable<User> {
    const user = new User(credential.email, []);

    return Observable.from([user]);
  }

  public signIn(credential: Credential): Observable<any> {
    
    return Observable.from([null]);
  }

  public getCurrentUserVerbose(): Observable<User> {

    return Observable.from([userMock]).delay(1500);
  }

  public signOut(): Observable<any> {

    return Observable.from([null]);
  }
}