import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';

import { Service } from '@modules/ticket/models/service/service.model';
import { contentBlockAnimation } from '@animations/content.animation';
import { QuestionComponent } from '../question/question.component';
import { Question } from '@modules/ticket/models/question/question.model';

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

  trackByQuestion(index, question: Question) {
    return question.correction ? question.correction : question;
  }
}
