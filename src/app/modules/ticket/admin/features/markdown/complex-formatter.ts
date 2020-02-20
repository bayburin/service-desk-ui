import { MarkdownFormatAttributesI } from './markdown-format-attributes.interface';
import { ComplexFormatterT } from './complex-formatter.abstract';
import { FormatterT } from './formatter.asbtract';

export class ComplexFormatter extends ComplexFormatterT {
  private formatter: FormatterT;

  setNext(nextFormatter: FormatterT) {
    this.formatter = nextFormatter;
  }

  format(nativeElement: any, template: string, attributes?: MarkdownFormatAttributesI): string {
    const markdownText = this.setFormat(nativeElement, template, attributes);

    return markdownText || this.formatter.format(nativeElement, template, attributes);
  }

  setFormat(nativeElement: any, template: string, attributes?: MarkdownFormatAttributesI): string {
    console.log('Not implemented');

    return;
  }
}
