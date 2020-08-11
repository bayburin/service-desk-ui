import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-claim-form-form',
  templateUrl: './claim-form-form.component.html',
  styleUrls: ['./claim-form-form.component.sass']
})
export class ClaimFormFormComponent implements OnInit {
  @Input() claimFormForm: FormGroup;
  @Input() submitted: boolean;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {}

  get form() {
    return this.claimFormForm.controls;
  }

  get groupsForm() {
    return  this.form.groups as FormArray;
  }

  /**
   * Добавить новую группу
   */
  addGroup(): void {
    this.groupsForm.push(this.createGroup());
    console.log(this.groupsForm);
  }

  private createGroup() {
    return this.formBuilder.group({
      id: [],
      is_default: [false],
      name: [],
      fields: this.formBuilder.array([])
    });
  }
}
