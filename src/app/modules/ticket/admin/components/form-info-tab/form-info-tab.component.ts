import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { contentBlockAnimation } from '@animations/content.animation';

@Component({
  selector: 'app-form-info-tab',
  templateUrl: './form-info-tab.component.html',
  styleUrls: ['./form-info-tab.component.sass'],
  animations: [contentBlockAnimation]
})
export class FormInfoTabComponent implements OnInit {
  @Input() ticketForm: FormGroup;

  constructor() { }

  ngOnInit() {}

  get form() {
    return this.ticketForm.controls;
  }

  get form_info() {
    return (this.form.form as FormGroup).controls;
  }
}
