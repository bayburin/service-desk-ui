import { MarkdownFormatAttributesI } from './markdown-format-attributes.interface';
import { ComplexFormatter } from './complex-formatter';

export class MidLineFormatter extends ComplexFormatter {
  format(nativeElement: any, template: string, attributes?: MarkdownFormatAttributesI) {
    this.initialize(nativeElement, template);
    template = attributes.multilineTemplate;
    if (!template.match(/term/)) {
      template = `${template}term`;
    }

    const leftPart = template.match(/([\B\w\W]*)term/)[1];
    const rightPart = template.match(/term([\B\w\W]*)/)[1];
    const extendSelection = this.getSelection(leftPart.length, rightPart.length);
    let textToInsert = this.getSelection() || attributes.defaultText;

    if (!rightPart && leftPart) {
      textToInsert = textToInsert.replace(/\n/g, `\n${leftPart}`);
    }

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
