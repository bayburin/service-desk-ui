import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { finalize, tap, switchMap } from 'rxjs/operators';

import { TicketService } from '@shared/services/ticket/ticket.service';
import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { NotificationService } from '@shared/services/notification/notification.service';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.sass'],
})
export class EditTicketComponent implements OnInit {
  submitted = false;
  modal: NgbModalRef;
  service: Service;
  ticket: Ticket;
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
  ) { }

  ngOnInit() {
    this.service = this.serviceService.service;
    this.route.data
      .pipe(
        tap((data) => this.ticket = data.ticket),
        switchMap(() => {
          if (this.ticket.responsibleUsers.length) {
            return this.responsibleUserService.loadDetails(this.ticket.getResponsibleUsersTn());
          } else {
            return of([]);
          }
        }),
        tap(() => this.responsibleUserService.associateDetailsFor(this.ticket))
      )
      .subscribe(() => {
        this.buildForm();
        this.openModal();
      });
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
    this.ticketService.updateTicket(this.ticket, this.ticketForm.getRawValue())
      .pipe(
        finalize(() => this.loading = false),
        tap((updatedTicket: Ticket) => {
          this.modal.close();
          this.redirectToService();
          this.serviceService.replaceTicket(this.ticket.id, updatedTicket);
          this.notifyService.setMessage('Вопрос обновлен');
        }),
        switchMap(updatedTicket => {
          return this.responsibleUserService.loadDetails(updatedTicket.getResponsibleUsersTn())
            .pipe(tap(() => this.responsibleUserService.associateDetailsFor(updatedTicket)));
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
      id: [this.ticket.id],
      service_id: [this.ticket.serviceId],
      name: [this.ticket.name, Validators.required],
      ticket_type: [this.ticket.ticketType],
      is_hidden: [this.ticket.isHidden],
      sla: [this.ticket.sla],
      to_approve: [this.ticket.toApprove],
      popularity: [this.ticket.popularity],
      tags: [this.ticket.tags],
      answers: this.formBuilder.array([]),
      responsible_users: [this.ticket.responsibleUsers]
    });
  }

  private redirectToService(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
