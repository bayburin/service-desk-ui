import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'app-form-group-section',
  templateUrl: './form-group-section.component.html',
  styleUrls: ['./form-group-section.component.sass']
})
export class FormGroupSectionComponent implements OnInit {
  previewForm = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [];
  selectedField: FormGroup;
  private counter = 0;
  @Input() groupForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {}

  get form() {
    return this.groupForm.controls;
  }

  get fieldsForm() {
    return this.form.fields as FormArray;
  }

  addField(type: string): void {
    const field = this.createField(type);

    this.fieldsForm.push(field);
    this.counter += 1;
    this.fields = [...this.fields, this.createPreview(field)];
  }

  private createField(type: string): FormGroup {
    return this.formBuilder.group({
      id: [],
      group_id: [],
      name: [`${type}_${this.counter}`],
      label: [`Field_${this.counter}`],
      type: [type]
    });
  }

  private createPreview(fieldFormGroup: FormGroup): FormlyFieldConfig {
    return {
      key: fieldFormGroup.controls.name.value,
      type: fieldFormGroup.controls.type.value,
      templateOptions: {
        label: fieldFormGroup.controls.label.value,
        placeholder: 'Formly is terrific!',
        focus: (field, event) => this.showFieldConfig(field, event)
      }
    };
  }

  private showFieldConfig(field, event) {
    this.selectedField = this.fieldsForm.controls.find((fieldGroup: FormGroup) => {
      return field.key === fieldGroup.controls.name.value;
    }) as FormGroup;

    // ! TODO: После этого необходимо отписываться.
    this.selectedField.valueChanges.subscribe(data => {
      field.templateOptions.label = data.label;
    });
  }
}
