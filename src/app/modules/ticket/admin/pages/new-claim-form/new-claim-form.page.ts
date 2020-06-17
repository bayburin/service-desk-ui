import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';

@Component({
  selector: 'app-new-claim-form-page',
  templateUrl: './new-claim-form.page.html',
  styleUrls: ['./new-claim-form.page.sass']
})
export class NewClaimFormPageComponent implements OnInit {
  submitted = false;
  service: Service;
  ticketForm: FormGroup;
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private serviceService: ServiceService
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
    // this.questionService.createTicket(this.ticketForm.getRawValue())
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
