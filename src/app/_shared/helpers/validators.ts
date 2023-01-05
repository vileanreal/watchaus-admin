import { FormControl } from '@angular/forms';

export class ValidationHelper {
    static notWhiteSpace(control: FormControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { whitespace: true };
    }

    static id(control: FormControl) {
        const isValid = control.value && control.value !== 0;
        return isValid ? null : { id: true };
    }
}
