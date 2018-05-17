import { AbstractControl } from '@angular/forms';


export class CustomValidator {

  static emailMatch(c: AbstractControl): { [key: string]: boolean } | null {
    const emailControl = c.get('email');
    const emailConfirmControl = c.get('emailConfirm');
    if (emailControl.value === emailConfirmControl.value) {
      return null;
    }

    return { emailMatch: true };
  }

  static passwordRequired(c: AbstractControl): { [key: string]: boolean } | null {
    if (!c.value.length) {
      return { passwordRequired: true };
    }

    return null;
  }

  static passwordMinLength(min: number) {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value.length < min) {
        return { passwordMinLength: true };
      }

      return null;
    };
  }

  static titleRequiredLength(c: AbstractControl): { [key: string]: boolean } | null {
    if (c.value.length < 1 || c.value.length > 256) {
      return { titlelength: true };
    }

    return null;
  }
}
