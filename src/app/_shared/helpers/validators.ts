import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

export class ValidationHelper {
    static notWhiteSpace(control: AbstractControl): ValidationErrors | null {
        const isWhitespace = control.value && control.value != '' && control.value.trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { whitespace: true };
    }

    static id(control: AbstractControl): ValidationErrors | null {
        const isValid = control.value && control.value !== 0;
        return isValid ? null : { id: true };
    }
}
