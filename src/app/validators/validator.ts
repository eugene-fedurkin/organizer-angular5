import { AbstractControl } from '@angular/forms';


export class CustomValidator {
  static emailMatch(c: AbstractControl): { [key: string]: boolean } | null {
    const emailControl = c.get('email');
    const emailConfirmControl = c.get('emailConfirm');
    console.log(emailControl.value, emailConfirmControl.value, emailControl.value === emailConfirmControl.value);
    if (emailControl.value === emailConfirmControl.value) {
      return null;
    }

    return { emailMatch: true };
  }
}
