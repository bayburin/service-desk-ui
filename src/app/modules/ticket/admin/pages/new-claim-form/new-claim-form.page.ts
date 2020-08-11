import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';
import { ClaimFormService } from '@shared/services/claim-form/claim-form.service';
import { finalize } from 'rxjs/operators';
import { NotificationService } from '@shared/services/notification/notification.service';

@Component({
  selector: 'app-new-claim-form-page',
  templateUrl: './new-claim-form.page.html',
  styleUrls: ['./new-claim-form.page.sass']
})
export class NewClaimFormPageComponent implements OnInit {
  submitted = false;
  service: Service;
  claimFormForm: FormGroup;
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private serviceService: ServiceService,
    private claimFormService: ClaimFormService,
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
    if (this.claimFormForm.invalid) {
      return;
    }

    this.loading = true;
    this.claimFormService.create(this.claimFormForm.getRawValue())
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          this.redirectToService();
          this.notifyService.setMessage('Новая форма заявки добавлена');
        },
        error => console.log(error)
      );
  }

  /**
   * Возвращается к маршруту на уровень выше.
   */
  cancel(): void {
    this.redirectToService();
  }

  private buildForm(): void {
    this.claimFormForm = this.formBuilder.group({
      id: [],
      description: [],
      destination: [],
      message: [],
      info: [],
      ticket: this.formBuilder.group({
        service_id: [this.service.id],
        name: ['', [Validators.required, Validators.maxLength(255)]],
        is_hidden: [false],
        sla: [null],
        popularity: [0],
        tags: [[]],
        responsible_users: [[]]
      }),
      groups: this.formBuilder.array([])
    });
  }

  private redirectToService(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
