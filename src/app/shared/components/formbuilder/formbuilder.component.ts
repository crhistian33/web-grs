import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FieldForm, IModule } from '@shared/models/form.model';
import { SubEntity } from '@shared/models/subentity.model';
import { FORM_MODULE } from '@shared/utils/form-fields';
import { BehaviorSubject, count, distinctUntilChanged, filter, map, Observable, of, Subject, Subscription, take, takeUntil, tap } from 'rxjs';
import { DataListComponent } from '../data-list/data-list.component';
import { Worker } from '@models/worker.model';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { Store } from '@ngxs/store';
import { WorkerState } from '@state/worker/worker.state';
import { WorkerActions } from '@state/worker/worker.action';
import { IDENTIFIES, TYPES } from '@shared/utils/constants';
import { Shift } from '@models/shift.model';
import { ShiftState } from '@state/shift/shift.state';
import { ShiftActions } from '@state/shift/shift.action';
import { WorkerFormState } from '@state/worker-form/worker-form.state';
import { WorkerFormAction } from '@state/worker-form/worker-form.actions';

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
  @Output() companyId = new EventEmitter<number>();

  myForm!: FormGroup;
  formModule?: IModule;
  nameControlTable?: string;

  readonly dataMap = new Map<string, any[]>();
  selectedWorkers$: Observable<Worker[]> = this.store.select(WorkerFormState.getSelectedItems);
  selectedShifts$: Observable<Shift[]> = this.store.select(ShiftState.getSelectedItems);
  areAllSelected$!: Observable<boolean>;

  getSubEntityItems$(id: string): Observable<any[]> {
    const subentities = this.subentities.find(e => e.id === id)?.data || of([]);
    if(id === 'company_id') {
      subentities.pipe(
        take(1),
        tap(items => {
          if(items.length === 1) {
            this.myForm.get(id)?.patchValue(items[0].id);
            this.myForm.get(id)?.disable();
          }
        })
      ).subscribe();
    }
    return subentities;
  }

  getSubEntityColumns$(id: string): Observable<DataListColumn<any>[]> {
    const subEntity = this.subentities.find(e => e.id === id);
    return subEntity ? of(subEntity.columns) : of([]);
  }

  getAreAllSelected$(): Observable<boolean> {
    const controlId = this.subentities.find(e => e.type === 'table')?.id
    switch (controlId) {
      case IDENTIFIES.WORKERS:
        return this.store.select(WorkerFormState.areAllSelected);
        break;
      case IDENTIFIES.SHIFTS:
        return this.store.select(ShiftState.areAllSelected);
        break;
      default:
        return of(false);
        break;
    }
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
    //.filter(controlName => entity.hasOwnProperty(controlName))
    .forEach(controlName => {
      if (controlName === this.nameControlTable) {
        const controlId = this.subentities.find(e => e.type === 'table')?.id
        switch (controlId) {
          case IDENTIFIES.WORKERS:
            this.selectedWorkers$
              .pipe(takeUntil(this.destroy$))
              .subscribe(selectedWorkers => {
                this.myForm.get(controlName)?.patchValue(selectedWorkers);
              });
            break;
          case IDENTIFIES.SHIFTS:
            this.selectedShifts$
              .pipe(takeUntil(this.destroy$))
              .subscribe(selectedShifts => {
                this.myForm.get(controlName)?.patchValue(selectedShifts);
              });
            break;
          default:
            break;
        }
      } else {
        console.log(controlName, entity[controlName]);
        switch (controlName) {
          case 'state':
            this.myForm.get(controlName)?.setValue(!!entity[controlName]);
            break;
          case 'type_worker_id':
            this.myForm.get(controlName)?.setValue(entity['typeworker'].id);
            break;
          case 'company_id':
            this.myForm.get(controlName)?.setValue(entity['company'].id);
            break;
          case 'unit_shift_id':
            this.myForm.get(controlName)?.patchValue(entity[controlName]);
            this.getCompanyID(controlName, entity[controlName]);
            break;
          default:
            this.myForm.get(controlName)?.patchValue(entity[controlName], {
              emitEvent: false
            });
            break;
        }
      }
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

  changeSelected(event: any, item: FieldForm) {
    const {name, prefix} = item;
    const selectedElement = event.target as HTMLSelectElement;
    const selectedValue = selectedElement.value;

    if(prefix) {
      if(name === 'company_id' || name === 'customer_id') {
        this.getSubEntityItems$(name).subscribe(items => {
          const selectedItem = items.find((item) => item.id === parseInt(selectedValue));
          if (selectedItem) {
            const code = selectedItem.code + '-';
            this.myForm.get('code')?.patchValue(code);
          }
        })
      }
    }
    if(name === 'unit_shift_id') {
      this.getCompanyID(name, selectedValue);
    }
  }

  private getCompanyID(name: string, id: string) {
    this.getSubEntityItems$(name).subscribe(items => {
      const selectedItem = items.find((item) => item.id === parseInt(id));
      if(selectedItem) {
        const companyId = selectedItem.unit.customer.company.id;
        this.companyId.emit(companyId);
      }
    })
  }

  private resetForm() {
    if (!this.myForm) return;

    this.myForm.reset();
    this.formModule?.fields
      .filter(field => field.value !== undefined)
      .forEach(field => {
        this.myForm.get(field.name)?.setValue(field.value);
        if(field.name === 'shifts')
          this.store.dispatch(new ShiftActions.ToggleAllItems(false, TYPES.LIST));
      });
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
    const controlId = this.subentities.find(e => e.type === 'table')?.id
    switch (controlId) {
      case IDENTIFIES.WORKERS:
        this.selectedWorker(id);
        break;
      case IDENTIFIES.SHIFTS:
        this.selectedShift(id);
        break;
      default:
        break;
    }
  }

  onToggleAll(checked: boolean) {
    const controlId = this.subentities.find(e => e.type === 'table')?.id
    console.log(controlId, IDENTIFIES.SHIFTS);
    switch (controlId) {
      case IDENTIFIES.WORKERS:
        this.selectedWorkers(checked);
        break;
      case IDENTIFIES.SHIFTS:
        this.selectedShifts(checked);
        break;
      default:
        break;
    }
  }

  private selectedWorker(id: number) {
    this.store.dispatch(new WorkerFormAction.ToggleItemSelection(id, TYPES.LIST));
    this.selectedWorkers$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedWorkers => {
        this.formModule!.fields.forEach(field => {
          if(field.type === 'table') {
            this.myForm.get(field.name)?.patchValue(selectedWorkers);
          }
        })
      });
  }

  private selectedShift(id: number) {
    this.store.dispatch(new ShiftActions.ToggleItemSelection(id, TYPES.LIST))
      .subscribe(data => console.log('Select', data));
    this.selectedShifts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedShifts => {
        this.formModule!.fields.forEach(field => {
          if(field.type === 'table') {
            this.myForm.get(field.name)?.patchValue(selectedShifts);
          }
        })
      });
  }

  private selectedWorkers(checked: boolean) {
    this.store.dispatch(new WorkerFormAction.ToggleAllItems(checked, TYPES.LIST));
    this.selectedWorkers$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedWorkers => {
        this.formModule!.fields.forEach(field => {
          if(field.type === 'table') {
            this.myForm.get(field.name)?.patchValue(selectedWorkers);
          }
        })
      });
  }

  private selectedShifts(checked: boolean) {
    this.store.dispatch(new ShiftActions.ToggleAllItems(checked, TYPES.LIST));
    this.selectedShifts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedShifts => {
        this.formModule!.fields.forEach(field => {
          if(field.type === 'table') {
            this.myForm.get(field.name)?.patchValue(selectedShifts);
          }
        })
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
    //this.store.dispatch(new WorkerFormAction.ClearItemSelection);
  }
}
