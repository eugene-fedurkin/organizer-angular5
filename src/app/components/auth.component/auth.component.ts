import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/finally';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IUserHttpService } from '../../interfaces/i.user.http';
import { Credentials } from '../../models/credential.model';
import { LoaderService } from '../../services/loader.service';
import { Store } from '../../services/store.service';
import { Base } from '../base.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent extends Base implements OnInit {

  public credentials = new Credentials();
  public authMod: string = 'Sign in';

  public constructor(
    private readonly httpService: IUserHttpService,
    private readonly store: Store,
    private readonly loader: LoaderService,
    private readonly router: Router,
  ) {
    super();
  }

  public signUp(): void {
    this.loader.show();

    this.httpService.registerUser(this.credentials)
      .takeUntil(this.componentDestroyed)
      .subscribe(user => {
          this.store.saveUser(user);
          this.router.navigate(['/lists']);
        },
        error => { throw Error(error); },
        () => this.loader.hide()
      );
  }

  public signIn(): void {
    this.loader.show();

    this.httpService.signIn(this.credentials)
      .takeUntil(this.componentDestroyed)
      .subscribe(resp => {
        this.httpService.getCurrentUserVerbose()
          .takeUntil(this.componentDestroyed)
          .finally(() => this.loader.hide())
          .subscribe(user => this.store.saveUser(user));
        this.router.navigate(['/lists']);
      },
      error => {
        console.log(error); // TODO: notify user
        this.credentials.password = '';
      }
    );
  }

  public toggleMod(): void {
    this.authMod = this.authMod === 'Sign in'
      ? 'Sign up'
      : 'Sign in';
  }

  public ngOnInit(): void {
    this.loader.show();
    this.httpService.getCurrentUserVerbose()
      .takeUntil(this.componentDestroyed)
      .finally(() => this.loader.hide())
      .subscribe(user => {
          this.store.saveUser(user);
          this.router.navigate(['/lists']);
        },
        error => { }
    );
  }
}
