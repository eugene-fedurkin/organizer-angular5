import { Observable } from 'rxjs/Observable';

import { Credential } from "../models/credential.model";
import { User } from "../models/user.model";

export abstract class IUserHttpService {
  public abstract registerUser(credential: Credential): Observable<User>;
  public abstract signIn(credential: Credential): Observable<any>;
  public abstract getCurrentUserVerbose(): Observable<User>;
  public abstract signOut(): Observable<any>;
}