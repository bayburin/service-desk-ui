import { MarkdownFormatAttributesI } from './markdown-format-attributes.interface';
import { FormatterT } from './formatter.asbtract';

export class SimpleTemplateFormatter extends FormatterT {
  format(nativeElement: any, template: string, attributes?: MarkdownFormatAttributesI): string {
    this.initialize(nativeElement, template);
    if (!template.match(/term/)) {
      template = `${template}term`;
    }

    const leftPart = template.match(/(.*)term/)[1];
    const rightPart = template.match(/term(.*)/)[1];
    const textToInsert = this.getSelection() || attributes.defaultText;
    const extendSelection = this.getSelection(leftPart.length, rightPart.length);

    let view = template.replace(/term/, textToInsert);
    let leftOffset = 0;
    let rightOffset = 0;
    let selectLeftOffset = leftPart.length;
    let selectRightOffset = rightPart.length;

    if (extendSelection === view) {
      leftOffset = leftPart.length;
      rightOffset = rightPart.length;
      selectLeftOffset = -leftPart.length;
      selectRightOffset = -rightPart.length;
      view = textToInsert;
    }

    const endPosition = this.start === this.end ? this.end + view.length - selectRightOffset : this.end + selectLeftOffset;

    this.setSelection(nativeElement, this.start + selectLeftOffset, endPosition);

    return nativeElement.value.substring(0, this.start - leftOffset) + view + nativeElement.value.substring(this.end + rightOffset);
  }
}
