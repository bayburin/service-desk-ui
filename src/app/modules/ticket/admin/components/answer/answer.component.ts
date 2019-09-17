import { Component, OnInit, Input } from '@angular/core';

import { AnswerI } from '@interfaces/answer.interface';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.sass']
})
export class AnswerComponent implements OnInit {
  @Input() answer: AnswerI;

  constructor() { }

  ngOnInit() {}
}
