import { MarkdownFormatAttributesI } from './markdown-format-attributes.interface';

export abstract class FormatterT {
  protected nativeElement: any;
  protected start: number;
  protected end: number;

  abstract format(nativeElement: any, template: string, attributes?: MarkdownFormatAttributesI): string;

  setSelection(nativeElement, start: number, end: number): void {
    setTimeout(() => {
      nativeElement.focus();
      nativeElement.setSelectionRange(start, end);
    }, 100);
  }

  protected initialize(nativeElement: any, template: string) {
    this.nativeElement = nativeElement;
    this.start = nativeElement.selectionStart;
    this.end = nativeElement.selectionEnd;
  }

  protected getSelection(leftOffset = 0, rightOffset = 0) {
    const start = this.start - leftOffset;
    const end = this.end + rightOffset;

    return this.nativeElement.value.substring(start, end);
  }
}
