import { FormControl } from '@angular/forms';

export function fileNameLength(maxLength: number = 120) {
  return (control: FormControl): { [s: string]: boolean } => {
    const file = control.value;

    if (!(file instanceof File)) {
      return null;
    }

    if (file.name.length > maxLength) {
      return { ['fileNameLength']: true };
    }

    return null;
  };
}
