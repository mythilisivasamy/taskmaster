import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function stringValidator(pattern: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isString: boolean = pattern.test(control.value);
    return !isString ? { isString: { value: control.value } } : null;
  };
}

export function emailValidator(pattern: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isEmail: boolean = pattern.test(control.value);
    return !isEmail ? { isEmail: { value: control.value } } : null;
  };
}
