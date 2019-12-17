import { Directive, HostListener } from '@angular/core';

import { QuestionPageContentComponent } from '@modules/ticket/components/question-page-content/question-page-content.component';

@Directive({
  selector: '[appShowQuestionLink]'
})
export class ShowQuestionLinkDirective {
  constructor(private component: QuestionPageContentComponent) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.component.linkAnimation = 'show';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.component.linkAnimation = 'hide';
  }
}
