import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/map';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

import { IUserHttpService } from '../../interfaces/i.user.http';
import { Credentials } from '../../models/credential.model';
import { LoaderService } from '../../services/loader.service';
import { NotificationService } from '../../services/notification.service';
import { Store } from '../../services/store.service';
import { CustomValidator } from '../../validators/validator';
import { Base } from '../base.component';
import { validationMessages } from './validation-masseges';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent extends Base implements OnInit {

  public authMod: string = 'Sign in';

  public constructor(
    private readonly httpService: IUserHttpService,
    private readonly store: Store,
    private readonly loader: LoaderService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly notify: NotificationService,
  ) {
    super();
  }

  public signUp(signUpForm: FormGroup): void {
    this.loader.show();
    const credentials = new Credentials(
      signUpForm.value.email,
      signUpForm.value.password);

    this.httpService.registerUser(credentials)
      .takeUntil(this.componentDestroyed)
      .subscribe(user => {
          this.store.saveUser(user);
          this.router.navigate(['/lists']);
        },
        error => this.notify.addNotification(error),
        () => this.loader.hide()
      );
  }

  public signIn(signInForm: FormGroup): void {
    this.loader.show();
    const credentials = new Credentials(
      signInForm.value.email,
      signInForm.value.password
    );

    this.httpService.signIn(credentials)
      .takeUntil(this.componentDestroyed)
      .finally(() => this.loader.hide())
      .subscribe(resp => {
        this.httpService.getCurrentUserVerbose()
          .takeUntil(this.componentDestroyed)
          .subscribe(user => this.store.saveUser(user));
        this.router.navigate(['/lists']);
      },
      error => {
        let message;
        if (error.status === 403) {
          message = 'Uncorrect email or password';
        } else {
          message = error.message;
        }
        this.notify.addNotification(message);
        // this.signInForm.value.password = '';
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
        }
    );
  }
}
