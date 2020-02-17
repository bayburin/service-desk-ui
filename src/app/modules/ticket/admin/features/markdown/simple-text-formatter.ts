import { FormatterT } from './formatter.asbtract';

export class SimpleTextFormatter extends FormatterT {
  format(nativeElement: any, template: string): string {
    this.initialize(nativeElement, template);

    const cursorPosition = this.end + template.length + 1;

    this.setSelection(nativeElement, cursorPosition, cursorPosition);

    return nativeElement.value.substring(0, this.start) + template + '\n' + nativeElement.value.substring(this.end);
  }
}
