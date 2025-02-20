import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Center } from '@models/center.model';
import { Customer } from '@models/customer.model';
import { Shift } from '@models/shift.model';
import { Unit } from '@models/unit.model';
import { Worker } from '@models/worker.model';
import { Store } from '@ngxs/store';
import { FormBuilderComponent } from '@shared/components/formbuilder/formbuilder.component';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { SubEntity } from '@shared/models/subentity.model';
import { HeaderDatalistService } from '@shared/services/header-datalist.service';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { IDENTIFIES, PARAMETERS, ROUTES, TITLES, TYPES } from '@shared/utils/constants';
import { CenterActions } from '@state/center/center.action';
import { CenterState } from '@state/center/center.state';
import { CustomerActions } from '@state/customer/customer.action';
import { CustomerState } from '@state/customer/customer.state';
import { ShiftActions } from '@state/shift/shift.action';
import { ShiftState } from '@state/shift/shift.state';
import { UnitActions } from '@state/unit/unit.actions';
import { UnitState } from '@state/unit/unit.state';
import { filter, forkJoin, Observable, skip, Subject, switchMap, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-form',
  imports: [CommonModule, FormBuilderComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly sweetAlertService = inject(SweetalertService);
  private readonly notificationService = inject(NotificationService);
  private readonly headerDataListService = inject(HeaderDatalistService);
  private readonly destroy$ = new Subject<void>();

  @Input() id!: number;
  readonly title: string = TITLES.UNIT;
  readonly route_list: string = ROUTES.UNIT_LIST;
  readonly module = PARAMETERS.UNIT;

  resetForm: boolean = false;
  readonly columnsShift: DataListColumn<Shift>[] = this.headerDataListService.getHeaderFormDataList(PARAMETERS.SHIFT);
  centers$: Observable<Center[]> = this.store.select(CenterState.getItems);
  customers$: Observable<Customer[]> = this.store.select(CustomerState.getItems);
  shifts$: Observable<Shift[]> = this.store.select(ShiftState.getItems);
  entity$: Observable<Unit | null> = this.store.select(UnitState.getEntity);

  readonly subentities: SubEntity[] = [
    { id: IDENTIFIES.CENTER, data: this.centers$, type:'select' },
    { id: IDENTIFIES.CUSTOMER, data: this.customers$, type: 'select' },
    { id: IDENTIFIES.SHIFTS, data: this.shifts$, type: 'table', columns: this.columnsShift },
  ];

  ngOnInit() {
    if(this.id)
      this.loadExistingAssignment();
  }

  private loadExistingAssignment(): void {
    this.entity$
    .pipe(
      skip(1),
      take(1),
      takeUntil(this.destroy$)
    )
    .subscribe(entity => {
      if (entity?.shifts?.length) {
        const selectionActions = entity.shifts.map(shift =>
          this.store.dispatch(new ShiftActions.ToggleItemSelection(shift.id, TYPES.LIST))
        );

        forkJoin(selectionActions)
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      }
    });

    this.store.dispatch(new UnitActions.GetById(this.id));
  }

  onSubmit(event: { data: any; redirect: boolean }) {
    const action = this.id
      ? new UnitActions.Update(this.id, event.data)
      : new UnitActions.Create(event.data);

    this.store.dispatch(action)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: any) => {
        this.handleSuccess(response, event.redirect);
      },
      error: (error) => {
        this.notificationService.show(
          error.error?.message || 'Error occurred',
          'error',
          5000
        );
      }
    });
  }

  private handleSuccess(response: any, redirect: boolean): void {
    const result = response.unit.result;
    this.sweetAlertService.confirmSuccess(
      result.title,
      result.message,
      () => {
        if (redirect) {
          this.router.navigate([this.route_list]);
        } else {
          this.resetForm = true;
        }
      }
    );
  }

  onClearReset(reset: boolean) {
    this.resetForm = reset;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(new UnitActions.clearEntity);
    this.store.dispatch(new ShiftActions.ClearItemSelection);
  }
}
