import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';

import { Service } from '@modules/ticket/models/service/service.model';
import { contentBlockAnimation } from '@animations/content.animation';
import { QuestionComponent } from '../question/question.component';
import { QuestionTicket } from '@modules/ticket/models/question-ticket/question-ticket.model';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.sass'],
  animations: [contentBlockAnimation]
})
export class ServiceDetailComponent implements OnInit {
  @Input() service: Service;
  @ViewChildren(QuestionComponent) questionTemplateComponent: QueryList<QuestionComponent>;

  constructor() { }

  ngOnInit() {}

  trackByQuestionTicket(index, question: QuestionTicket) {
    return question.correction ? question.correction : question;
  }
}
