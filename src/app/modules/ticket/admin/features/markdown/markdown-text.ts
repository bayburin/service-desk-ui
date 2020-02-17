import { ElementRef } from '@angular/core';

import { MarkdownFormatAttributesI } from './markdown-format-attributes.interface';
import { FormatterT } from './formatter.asbtract';

export class MarkdownText {
  private el: any;

  constructor(private elementRef: ElementRef) {
    this.el = elementRef.nativeElement;
  }

  format(formatter: FormatterT, template: string, attributes?: MarkdownFormatAttributesI): string {
    return formatter.format(this.el, template, attributes);
  }
}
