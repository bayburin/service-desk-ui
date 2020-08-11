import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { contentBlockAnimation } from '@animations/content.animation';

@Component({
  selector: 'app-form-info-section',
  templateUrl: './form-info-section.component.html',
  styleUrls: ['./form-info-section.component.sass'],
  animations: [contentBlockAnimation]
})
export class FormInfoSectionComponent implements OnInit {
  @Input() claimFormForm: FormGroup;

  constructor() { }

  ngOnInit() {}

  get form() {
    return this.claimFormForm.controls;
  }

  get ticketForm() {
    return this.form.ticket as FormGroup;
  }
}
