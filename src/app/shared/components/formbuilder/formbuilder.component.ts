import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IModule } from '@shared/models/form.model';
import { SubEntity } from '@shared/models/subentity.model';
import { FORM_MODULE } from '@shared/utils/form-fields';
import { BehaviorSubject, distinctUntilChanged, filter, map, Observable, of, Subject, Subscription, take, takeUntil } from 'rxjs';
import { DataListComponent } from '../data-list/data-list.component';
import { Worker } from '@models/worker.model';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { Store } from '@ngxs/store';
import { WorkerState } from '@state/worker/worker.state';
import { WorkerActions } from '@state/worker/worker.action';

@Component({
  selector: 'app-formbuilder',
  imports: [CommonModule, ReactiveFormsModule, DataListComponent],
  templateUrl: './formbuilder.component.html',
  styleUrl: './formbuilder.component.scss',
})
export class FormBuilderComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly destroy$ = new Subject<void>();

  @Input() id!: number;
  @Input() title!: string;
  @Input() entity!: any;
  @Input() module!: string;
  @Input() subentities: SubEntity[] = [];
  @Input() route!: string;
  @Input() reset!: boolean;
  @Output() formSubmitted = new EventEmitter<{ data: any, redirect: boolean }>();
  @Output() clearReset = new EventEmitter<boolean>();

  myForm!: FormGroup;
  formModule?: IModule;
  nameControlTable?: string;

  readonly dataMap = new Map<string, any[]>();
  selectedItems$: Observable<Worker[]> = this.store.select(WorkerState.getSelectedItems);

  columns: DataListColumn<Worker>[] = [
    { key: 'id', label: 'N°', type: 'number'},
    { key: 'name', label: 'Nombres y apellidos', type: 'text'},
    { key: 'dni', label: 'DNI', type: 'text'},
  ];

  getSubEntityItems$(id: string): Observable<any[]> {
    return this.subentities.find(e => e.id === id)?.data || of([]);
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.formModule = FORM_MODULE[this.module];

    if (!this.formModule?.fields) {
      console.warn('No se ha encontrado los campos para el modulo: ', this.module);
      return;
    }

    const formGroup = this.createFormGroup();
    this.myForm = this.fb.group(formGroup, { updateOn: 'change' });

    if (this.entity) {
      this.updateFormValues(this.entity);
    }
  }

  private createFormGroup(): { [key: string]: any } {
    return this.formModule!.fields.reduce((group, field) => {
      if (field.type === 'table') {
        this.nameControlTable = field.name;
      }
      const validators = this.buildValidators(field);
      const initialValue = this.entity?.[field.name] ?? field.value;
      return { ...group, [field.name]: [initialValue, validators] };
    }, {});
  }

  private buildValidators(field: any): any[] {
    if (!field.validators) return [];

    return field.validators.map((validation: any) => {
      switch (validation.validator) {
        case 'required': return Validators.required;
        case 'maxLength(20)': return Validators.maxLength(20);
        default: return null;
      }
    }).filter(Boolean);
  }

  private updateFormValues(entity: any) {
    if (!entity || !this.myForm) return;

    Object.keys(this.myForm.controls)
    .filter(controlName => entity.hasOwnProperty(controlName))
    .forEach(controlName => {
      if (controlName === this.nameControlTable) {
        this.selectedItems$
          .pipe(takeUntil(this.destroy$))
          .subscribe(selectedWorkers => {
            this.myForm.get(controlName)?.patchValue(selectedWorkers);
          });
      } else {
        if(controlName === 'state') {
          this.myForm.get(controlName)?.setValue(!!entity[controlName]);
        }
        else
          this.myForm.get(controlName)?.patchValue(entity[controlName], {
            emitEvent: false
          });
      }
    });
  }

  private resetForm() {
    if (!this.myForm) return;

    this.myForm.reset();
    this.formModule?.fields
      .filter(field => field.value !== undefined)
      .forEach(field => {
        this.myForm.get(field.name)?.setValue(field.value);
      });
  }

  onSubmit(redirect: boolean) {
    if (this.myForm.valid) {
      this.formSubmitted.emit({
        data: this.myForm.getRawValue(),
        redirect
      });
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.resetForm();
    this.router.navigate([this.route]);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['entity']?.currentValue && this.myForm) {
      this.updateFormValues(changes['entity'].currentValue);
    }
    if (changes['reset']?.currentValue && this.myForm) {
      this.resetForm();
      setTimeout(() => {
        this.clearReset.emit(false);
      });
    }
  }

  onToggleItem(id: number) {
    this.store.dispatch(new WorkerActions.ToggleItemSelection(id));
    this.selectedItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedWorkers => {
        this.myForm.get('workers')?.patchValue(selectedWorkers);
      });
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new WorkerActions.ToggleAllItems(checked));
    this.selectedItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedWorkers => {
        this.myForm.get('workers')?.patchValue(selectedWorkers);
      });
  }

  getErrorMessage(control: any) {
    const formControl = this.myForm.get(control.name);
    const error = control.validators?.find(
      (validation: any) => formControl?.hasError(validation.name)
    );
    return error?.message || '';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
