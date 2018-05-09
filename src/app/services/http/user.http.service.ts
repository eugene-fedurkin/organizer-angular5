import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IUserHttpService } from '../../interfaces/i.user.http';
import { Credentials } from '../../models/credential.model';
import { User } from '../../models/user.model';

@Injectable()
export class UserHttpService implements IUserHttpService {

  private readonly usersUrl = 'https://organizerapi.azurewebsites.net/users';
  private readonly options = {
    withCredentials: true
  };

  public constructor(private readonly http: HttpClient) {}

  public registerUser(credential: Credentials): Observable<User> {
    return this.http.post<User>(this.usersUrl, credential, this.options);
  }

  public signIn(credential: Credentials): Observable<any> {
    return this.http.post(`${this.usersUrl}/signin`, credential, this.options);
  }

  public getCurrentUserVerbose(): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/verbose`, this.options);
  }

  public signOut(): Observable<void> {
    return this.http.get<void>(`${this.usersUrl}/signout`, this.options);
  }
}
