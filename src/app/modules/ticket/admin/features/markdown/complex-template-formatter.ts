import { MidLineFormatter } from './midline-formatter';
import { EmptyLineFormatter } from './empty-line-formatter';
import { MarkdownFormatAttributesI } from './markdown-format-attributes.interface';
import { FormatterT } from './formatter.asbtract';

export class ComplexTemplateFormatter extends FormatterT {
  format(nativeElement: any, template: string, attributes?: MarkdownFormatAttributesI): string {
    this.initialize(nativeElement, template);

    const emptyLine = new EmptyLineFormatter();

    emptyLine.setNext(new MidLineFormatter());

    return emptyLine.format(nativeElement, template, attributes);
  }
}
