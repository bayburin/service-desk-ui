import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, tap, switchMap } from 'rxjs/operators';

import { TicketService } from '@shared/services/ticket/ticket.service';
import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';
import { contentBlockAnimation } from '@animations/content.animation';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { NotificationService } from '@shared/services/notification/notification.service';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  styleUrls: ['./new-ticket.component.sass'],
  animations: [contentBlockAnimation]
})
export class NewTicketComponent implements OnInit {
  submitted = false;
  modal: NgbModalRef;
  service: Service;
  ticketForm: FormGroup;
  loading = false;
  @ViewChild('content', { static: true }) content: ElementRef;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private serviceService: ServiceService,
    private ticketService: TicketService,
    private notifyService: NotificationService,
    private responsibleUserService: ResponsibleUserService
  ) {}

  ngOnInit() {
    this.service = this.serviceService.service;
    this.openModal();
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
    this.ticketService.createTicket(this.ticketForm.getRawValue())
      .pipe(
        finalize(() => this.loading = false),
        tap((createdTicket: Ticket) => {
          this.modal.close();
          this.redirectToService();
          this.serviceService.addTickets([createdTicket]);
          this.ticketService.addDraftTickets([createdTicket]);
          this.notifyService.setMessage('Новый вопрос добавлен');
        }),
        switchMap(createdTicket => {
          return this.responsibleUserService.loadDetails(createdTicket.getResponsibleUsersTn())
            .pipe(tap(details => createdTicket.associateResponsibleUserDetails(details)));
        })
      )
      .subscribe(
        () => {},
        error => console.log(error)
      );
  }

  /**
   * Возвращается к маршруту на уровень выше.
   */
  cancel(): void {
    this.modal.dismiss();
    this.redirectToService();
  }

  private openModal(): void {
    this.modal = this.modalService.open(
      this.content,
      {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        windowClass: 'modal-holder'
      }
    );
  }

  private buildForm(): void {
    this.ticketForm = this.formBuilder.group({
      service_id: [this.service.id],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      ticket_type: ['question'],
      is_hidden: [false],
      sla: [null],
      to_approve: [false],
      popularity: [0],
      tags: [[]],
      answers: this.formBuilder.array([]),
      responsible_users: [[]]
    });
  }

  private redirectToService(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
