import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClient } from '@angular/common/http';
import { IUserHttpService } from '../../interfaces/i.user.http';

import { Credential } from '../../models/credential.model';
import { User } from '../../models/user.model';
// import { RequestOptions } from '@angular/http';

@Injectable()
export class UserHttpService implements IUserHttpService {

  private url = 'https://organizerapi.azurewebsites.net';
  private readonly options = { // TODO: RequestOption is doesnt work
    withCredentials: true
  };

  constructor(private http: HttpClient) {}

  public registerUser(credential: Credential): Observable<User> {
    return this.http.post<User>(`${this.url}/users`, credential, this.options);
  }

  public signIn(credential: Credential): Observable<any> {
    return this.http.post(`${this.url}/users/signin`, credential, this.options);
  }

  public getCurrentUserVerbose(): Observable<User> {
    return this.http.get<User>(`${this.url}/users/verbose`, this.options);
  }

  public signOut(): Observable<any> {

    return this.http.get(`${this.url}/users/signout`, this.options);
  }
}