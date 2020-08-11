import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-form-group-section',
  templateUrl: './form-group-section.component.html',
  styleUrls: ['./form-group-section.component.sass']
})
export class FormGroupSectionComponent implements OnInit {
  @Input() groupForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {}

  get form() {
    return this.groupForm.controls;
  }
}
