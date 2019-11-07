import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { toggleAnswer } from '@modules/ticket/animations/toggle-answer.animation';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { Answer } from '@modules/ticket/models/answer/answer.model';
import { ServiceService } from '@shared/services/service/service.service';
import { TicketService } from '@shared/services/ticket/ticket.service';
import { NotificationService } from '@shared/services/notification/notification.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.sass'],
  animations: [toggleAnswer]
})
export class QuestionComponent implements OnInit {
  @Input() question: Ticket;
  open: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private ticketService: TicketService,
    private notifyService: NotificationService
  ) {}

  ngOnInit() {
    if (this.question.correction) {
      this.showCorrection();
    }
  }

  /**
   * "Раскрывает" вопрос.
   */
  toggleQuestion(): void {
    this.question.open = !this.question.open;
  }

  trackByAnswer(index, answer: Answer) {
    return answer.id;
  }

  /**
   * Перейти по адресу редактирования вопроса.
   */
  editQuestion(): void {
    this.router.navigate([this.question.id, 'edit'], { relativeTo: this.route });
  }

  /**
   * Показать исправления.
   */
  showCorrection(): void {
    this.open = this.question.open;
    this.question = this.question.correction;
    this.question.open = this.open;
  }

  /**
   * Показать оригинал.
   */
  showOriginal(): void {
    this.open = this.question.open;
    this.question = this.question.original;
    this.question.open = this.open;
  }

  /**
   * Опубликовать вопрос.
   */
  publishQuestion(): void {
    if (!confirm('Вы действительно хотите опубликовать вопрос?')) {
      return;
    }

    this.ticketService.publishTickets([this.question]).subscribe(tickets => {
      if (tickets.length === 0) {
        return;
      }

      this.serviceService.replaceTicket((this.question.original || this.question).id, tickets[0]);
      this.notifyService.setMessage('Вопрос опубликован');
    });
  }
}
