import { Observable } from 'rxjs/Observable';

import { Credentials } from '../models/credential.model';
import { User } from '../models/user.model';

export abstract class IUserHttpService {
  public abstract registerUser(credential: Credentials): Observable<User>;
  public abstract signIn(credential: Credentials): Observable<any>;
  public abstract getCurrentUserVerbose(): Observable<User>;
  public abstract signOut(): Observable<void>;
}
