import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/finally';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IUserHttpService } from '../../interfaces/i.user.http';
import { Credentials } from '../../models/credential.model';
import { LoaderService } from '../../services/loader.service';
import { Store } from '../../services/store.service';
import { Base } from '../base.component';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { CustomValidator } from '../../validators/validator';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent extends Base implements OnInit {

  public errorMessages: string = '';
  private validationMessages = {
    emailMatch: 'Email must be matched',
    email: 'Is it not email',
    required: 'Email and password required',
  };
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
        error => { throw Error(error); },
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
        console.log(error); // TODO: notify user
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
        },
        error => {
        }
    );
  }

  private createForm(): void {
    this.signInForm = this.fb.group({
      email: '',
      password: '',
    });

    this.signUpForm = this.fb.group({
      emailGroup: this.fb.group({
        email: ['', { validators: [ Validators.required, Validators.email ]}],
        emailConfirm: '',
      },
    { validator: CustomValidator.emailMatch }),
      password: '',
    });
  }

  private watchChanges(): void {
    const emailGroup = this.signUpForm.get('emailGroup');
    const emailControl = this.signUpForm.get('emailGroup.email');

    emailGroup.valueChanges
      .takeUntil(this.componentDestroyed)
      .subscribe(value => this.setMessage(emailGroup));
    emailControl.valueChanges
      .takeUntil(this.componentDestroyed)
      .subscribe(value => this.setMessage(emailControl));
  }

  private setMessage(c: AbstractControl): void {
    if ((c.dirty || c.touched) && c.errors) {
      console.log(c.errors);
      this.errorMessages = Object.keys(c.errors)
      .map(key => this.validationMessages[key])
      .join(' '); // TODO: add array to massage
      this.notify.validationWarning(this.errorMessages);
    }
  }
}
