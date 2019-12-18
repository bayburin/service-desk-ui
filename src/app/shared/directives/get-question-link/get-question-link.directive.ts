import { Directive, HostListener } from '@angular/core';

import { QuestionPageContentComponent } from '@modules/ticket/components/question-page-content/question-page-content.component';
import { NotificationService } from '@shared/services/notification/notification.service';

@Directive({
  selector: '[appGetQuestionLink]'
})
export class GetQuestionLinkDirective {
  constructor(private component: QuestionPageContentComponent, private notifyService: NotificationService) {}

  @HostListener('click', ['$event']) onClick(event: Event) {
    event.stopPropagation();
    const selBox = document.createElement('textarea');

    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = location.origin + this.component.data.getShowLink();
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.notifyService.setMessage('Ссылка на вопрос добавлена в буфер обмена');
  }
}
