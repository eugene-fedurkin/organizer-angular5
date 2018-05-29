import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomValidator } from '../../validators/validator';
import { debounceTime } from 'rxjs/operators';
import { Base } from '../base.component';
import { validationMessages } from '../auth.component/validation-masseges';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent extends Base implements OnInit {

  @Output() public signUpEvent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() public toggleEvent: EventEmitter<void> = new EventEmitter<void>();
  private validationMessages = validationMessages;
  public signUpForm: FormGroup;
  public signUpErrorMessages = {
    messages: [],
    isValid: false,
  };

  constructor(private readonly fb: FormBuilder) {
    super();
  }

  public signUp(): void {
    this.signUpEvent.emit(this.signUpForm);
  }

  public toggleMod(): void {
    this.toggleEvent.emit();
  }

  public ngOnInit(): void {
    this.createForm();
    this.watchChanges();
  }

  private createForm(): void {
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
  }

  private setToInvalid(): void {
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

  private pushMessage(errors: { [key: string]: any }): void {
    const messages = Object.keys(errors)
      .map(key => this.validationMessages[key]);

    this.signUpErrorMessages.messages.push(...messages);
  }
}
