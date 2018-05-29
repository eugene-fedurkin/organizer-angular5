import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { CustomValidator } from '../../validators/validator';
import { Base } from '../base.component';
import { validationMessages } from '../auth.component/validation-masseges';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent extends Base implements OnInit {

  @Output() public toggleModEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() public signInEvent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  public signInForm: FormGroup;
  public signInErrorMessages = {
    messages: [],
    isValid: false,
  };
  private validationMessages = validationMessages;

  constructor(
    private readonly fb: FormBuilder,
  ) { super(); }

  public toggleMod(): void {
    this.toggleModEvent.emit();
  }

  public signIn(): void {
    this.signInEvent.emit(this.signInForm);
  }

  public ngOnInit(): void {
    this.createForm();
    this.watchChanges();
  }

  private createForm(): void {
    this.signInForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', { validators: [
        CustomValidator.passwordRequired,
        CustomValidator.passwordMinLength(6)
      ]}],
    });
  }

  private watchChanges(): void {
    this.signInForm.valueChanges
    .map(() => this.setToInvalid())
    .pipe(debounceTime(700))
    .takeUntil(this.componentDestroyed)
    .subscribe(value => this.setMessageToSignInForm(this.signInForm));
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

      this.signInErrorMessages.messages.push(...messages);
  }

  private setToInvalid(): void {
    this.signInErrorMessages.isValid = true;
  }
}
