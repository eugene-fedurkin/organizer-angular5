import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/takeUntil';

import { Router } from '@angular/router';

import { IUserHttpService } from '../../interfaces/i.user.http';
import { Store } from '../../services/store.service';
import { LoaderService } from '../../services/loader.service';

import { Credential } from '../../models/credential.model';
import { Base } from '../base.component';

@Component({
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class Auth extends Base {
  public email: string = '';
  public password: string = '';
  public authMod: string = 'Sign in';

  constructor(
    private httpService: IUserHttpService,
    private store: Store,
    private loader: LoaderService,
    private router: Router,
  ) {
    super();
  }

  public signUp(): void {
    this.loader.show();
    const credential: Credential = {
      email: this.email,
      password: this.password,
    }

    this.httpService.registerUser(credential)
      .takeUntil(this.destroy)
      .subscribe(user => {
        this.store.saveUser(user);
        this.router.navigate(['/lists']);
        this.loader.hide();
      },
        error => {throw Error(error)}
      );
  }

  public signIn(): void {
    this.loader.show();
    const credential: Credential = {
      email: this.email,
      password: this.password,
    }

    this.httpService.signIn(credential)
      .takeUntil(this.destroy)
      .subscribe(resp => {
        this.httpService.getCurrentUserVerbose()
          .takeUntil(this.destroy)
          .subscribe(user => this.store.saveUser(user));
          this.router.navigate(['/lists']);
          this.loader.hide();
      },
        error => console.log(error)
      );
  }

  public toggleMod(): void {
    this.authMod = this.authMod === 'Sign in'
      ? 'Sign up'
      : 'Sign in';
  }

  ngOnInit() {
    // this.loader.show();
    // this.httpService.getCurrentUserVerbose()
    //   .takeUntil(this.destroy)
    //   .subscribe(user => {
    //     this.store.saveUser(user);
    //     this.router.navigate(['/lists']);
    //     this.loader.hide();
    //   },
    //   error => {
    //     if (error.status === 401 || error.status === 404) {
    //       console.log(error.statusText);
    //       this.loader.hide();
    //     } else {
    //       throw new Error(error);
    //     }
    //   }
    // );
  }
}
