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

  public signInErrorMessages = {
    messages: [],
    isValid: false,
  };
  public signUpErrorMessages = {
    messages: [],
    isValid: false,
  };
  private validationMessages = validationMessages;
  public authMod: string = 'Sign in';
  public signInForm: FormGroup;
  public signUpForm: FormGroup;

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

  public signUp(): void {
    this.loader.show();
    const credentials = new Credentials(
      this.signUpForm.value.email,
      this.signUpForm.value.password);

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

  public signIn(): void {
    this.loader.show();
    const credentials = new Credentials(
      this.signInForm.value.email,
      this.signInForm.value.password);

    this.httpService.signIn(credentials)
      .takeUntil(this.componentDestroyed)
      .subscribe(resp => {
        this.httpService.getCurrentUserVerbose()
          .takeUntil(this.componentDestroyed)
          .finally(() => this.loader.hide())
          .subscribe(user => this.store.saveUser(user));
        this.router.navigate(['/lists']);
      },
      error => {
        this.notify.addNotification(error);
        this.signInForm.value.password = '';
      }
    );
  }

  public toggleMod(): void {
    this.authMod = this.authMod === 'Sign in'
      ? 'Sign up'
      : 'Sign in';
  }

  public ngOnInit(): void {
    this.createForm();
    this.watchChanges();
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

  private createForm(): void {
    this.signInForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', { validators: [ CustomValidator.passwordRequired, CustomValidator.passwordMinLength(6) ]}],
    });

    this.signUpForm = this.fb.group({
      emailGroup: this.fb.group({
        email: ['', { validators: [ Validators.required, Validators.email ]}],
        emailConfirm: '',
      },
    { validator: CustomValidator.emailMatch }),
      password: ['', { validators: [ CustomValidator.passwordRequired, CustomValidator.passwordMinLength(6) ]}],
    });
  }

  private watchChanges(): void {
    this.signUpForm.valueChanges
      .map(() => this.setToInvalid())
      .pipe(debounceTime(700))
      .takeUntil(this.componentDestroyed)
      .subscribe(value => this.setMessageToSignUpForm(this.signUpForm));

    this.signInForm.valueChanges
      .map(() => this.setToInvalid())
      .pipe(debounceTime(700))
      .takeUntil(this.componentDestroyed)
      .subscribe(value => this.setMessageToSignInForm(this.signInForm));
  }

  private setToInvalid(): void {
    this.signInErrorMessages.isValid = true;
    this.signUpErrorMessages.isValid = true;
  }

  private setMessageToSignUpForm(c: FormGroup): void {
    this.signUpErrorMessages.messages = [];
    const emailGroup = c.get('emailGroup');
    const email = c.get('emailGroup.email');
    const emailConfirm = c.get('emailGroup.emailConfirm');
    const password = c.get('password');

    if ((email.dirty || email.touched) && email.errors) { // email messages
      this.pushMessage(email.errors);
    }
    if ((emailConfirm.dirty || emailConfirm.touched) && emailConfirm.errors) { // email confirm messages
      this.pushMessage(emailConfirm.errors);
    }
    if ((emailGroup.dirty || emailGroup.touched) && emailGroup.errors) { // email and email confirm messages
      this.pushMessage(emailGroup.errors);
    }
    if ((password.dirty || password.touched) && password.errors) { // password messages
      this.pushMessage(password.errors);
    }

    this.signUpErrorMessages.isValid = !!this.signUpErrorMessages.messages.length;
  }

  private setMessageToSignInForm(c: FormGroup): void {
    this.signInErrorMessages.messages = [];
    const email = c.get('email');
    const password = c.get('password');

    if ((email.dirty || email.touched) && email.errors) { // email messages
      this.pushMessage(email.errors);
    }
    if ((password.dirty || password.touched) && password.errors) { // password messages
      this.pushMessage(password.errors);
    }

    this.signInErrorMessages.isValid = !!this.signInErrorMessages.messages.length;
  }

  private pushMessage(errors: { [key: string]: any }): void {
    const messages = Object.keys(errors)
      .map(key => this.validationMessages[key]);

    if (this.authMod === 'Sign in') {
      this.signInErrorMessages.messages.push(...messages);
    } else {
      this.signUpErrorMessages.messages.push(...messages);
    }
  }
}
