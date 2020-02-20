import { MarkdownFormatAttributesI } from './markdown-format-attributes.interface';
import { FormatterT } from './formatter.asbtract';

export abstract class ComplexFormatterT extends FormatterT {
  abstract setNext(formatter: FormatterT): void;
  abstract setFormat(nativeElement: any, template: string, attributes?: MarkdownFormatAttributesI): string;
}
