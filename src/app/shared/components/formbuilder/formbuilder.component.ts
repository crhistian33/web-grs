import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IModule } from '@shared/models/form.model';
import { SubEntity } from '@shared/models/subentity.model';
import { FORM_MODULE } from '@shared/utils/form-fields';
import { map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-formbuilder',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formbuilder.component.html',
  styleUrl: './formbuilder.component.scss',
})
export class FormBuilderComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  @Input() id!: number;
  @Input() title!: string;
  @Input() entity!: any;
  @Input() module!: string;
  @Input() subentities: SubEntity[] = [];
  @Input() route!: string;
  @Input() reset!: boolean;
  @Output() formSubmitted = new EventEmitter<{ data: any, redirect: boolean }>();
  myForm!: FormGroup;
  formModule?: IModule;
  private dataMap: Map<string, any[]> = new Map();
  private subscriptions: Subscription = new Subscription();

  ngOnInit() {
    this.formModule = FORM_MODULE[this.module];
    this.initForm();

    this.subentities.forEach(subentity => {
      const subscription = subentity.data.subscribe(data => {
        this.dataMap.set(subentity.id, data);
      });
      this.subscriptions.add(subscription);
    });
  }

  private initForm() {
    const group: { [key: string]: any } = {};

    this.formModule?.fields.forEach(field => {
      let controlValidators: any[] = [];
      if(field.validators) {
        field.validators.forEach((validation: any) => {
          if (validation.validator === 'required') controlValidators.push(Validators.required);
          if (validation.validator === 'maxLength(20)') controlValidators.push(Validators.maxLength(20));
        });
      }
      group[field.name] = [field.value, controlValidators];
    });

    this.myForm = this.fb.group(group, {
      updateOn: 'change',
    });
  }

  onSubmit(redirect: boolean) {
    const data = this.myForm.getRawValue();
    if(this.myForm.valid) {
      this.formSubmitted.emit({ data, redirect })
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.router.navigate([this.route]);
  }

  getEntity() {
    if(this.entity) {
      this.myForm.patchValue(this.entity);
    }
  }

  getSubEntity(id: string):any[] {
    const entity = this.subentities.find(e => e.id === id);
    return this.dataMap.get(entity?.id || '') || [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['reset'] && this.reset) {
      const resetValues: Record<string, any> = {};
      this.formModule?.fields.forEach(field => {
        resetValues[field.name] = field.value || '';
      });
      this.myForm.reset(resetValues);
    }
    if(changes['entity']) {
      this.getEntity();
    }
  }

  getErrorMessage(control: any) {
    const formControl = this.myForm.get(control.name);
    for (let validation of control.validators) {
      if (formControl?.hasError(validation.name)) {
         return validation.message;
      }
    }
    return '';
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
