import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { QuestionTicketService } from '@shared/services/question-ticket/question-ticket.service';
import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';
import { NotificationService } from '@shared/services/notification/notification.service';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

@Component({
  selector: 'app-new-case-page',
  templateUrl: './new-case.page.html',
  styleUrls: ['./new-case.page.sass']
})
export class NewCasePageComponent implements OnInit {
  submitted = false;
  service: Service;
  ticketForm: FormGroup;
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private serviceService: ServiceService,
    private questionTicketService: QuestionTicketService,
    private notifyService: NotificationService
  ) {}

  ngOnInit() {
    this.service = this.serviceService.service;
    this.buildForm();
  }

  /**
   * Сохраняет вопрос.
   */
  save(): void {
    this.submitted = true;
    if (this.ticketForm.invalid) {
      return;
    }

    this.loading = true;
    // this.questionTicketService.createTicket(this.ticketForm.getRawValue())
    //   .pipe(finalize(() => this.loading = false))
    //   .subscribe(
    //     () => {
    //       this.redirectToService();
    //       this.notifyService.setMessage('Новый вид заявки добавлен');
    //     },
    //     error => console.log(error)
    //   );
  }

  /**
   * Возвращается к маршруту на уровень выше.
   */
  cancel(): void {
    this.redirectToService();
  }

  private buildForm(): void {
    this.ticketForm = this.formBuilder.group({
      service_id: [this.service.id],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      ticket_type: [TicketTypes.CASE],
      is_hidden: [false],
      sla: [null],
      popularity: [0],
      tags: [[]],
      responsible_users: [[]],
      form: this.formBuilder.group({
        id: [],
        ticket_id: [],
        description: [],
        success_message: [],
        destination: [],
        info: []
      })
    });
  }

  private redirectToService(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
