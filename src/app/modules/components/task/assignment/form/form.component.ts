import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subject, filter, switchMap, take, takeUntil } from 'rxjs';

import { Assignment } from '@models/assignment.model';
import { Worker } from '@models/worker.model';
import { FormBuilderComponent } from '@shared/components/formbuilder/formbuilder.component';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { IDENTIFIES, PARAMETERS, ROUTES, TITLES, TYPES } from '@shared/utils/constants';
import { AssignmentActions } from '@state/assignment/assignment.actions';
import { AssignmentState } from '@state/assignment/assignment.state';
import { UnitActions } from '@state/unit/unit.actions';
import { UnitState } from '@state/unit/unit.state';
import { WorkerActions } from '@state/worker/worker.action';
import { WorkerState } from '@state/worker/worker.state';
import { VerifiedAction } from '@shared/state/verified/verified.actions';
import { VerifiedState } from '@shared/state/verified/verified.state';
import { UnitShiftActions } from '@state/unitshift/unitshift.actions';
import { UnitshiftState } from '@state/unitshift/unitshift.state';
import { UnitShift } from '@models/unitshift.model';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { SubEntity } from '@shared/models/subentity.model';
import { HeaderDatalistService } from '@shared/services/header-datalist.service';

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
  readonly title: string = TITLES.ASSIGNMENT;
  readonly route_list: string = ROUTES.ASSIGNMENT_LIST;
  readonly module = PARAMETERS.ASSIGNMENT;

  resetForm = false;
  readonly columnsWorker: DataListColumn<Worker>[] = this.headerDataListService.getHeaderFormDataList(PARAMETERS.WORKER);

  unitshifts$: Observable<UnitShift[]> = this.store.select(UnitshiftState.getItems);
  workers$: Observable<Worker[]> = this.store.select(WorkerState.getItems);
  selectedItems$: Observable<Worker[]> = this.store.select(WorkerState.getSelectedItems);
  entity$: Observable<Assignment | null> = this.store.select(AssignmentState.getEntity).pipe(filter(Boolean));
  $ifAssign: Observable<boolean> = this.store.select(VerifiedState.getVerified);

  readonly subentities: SubEntity[] = [
    { id: IDENTIFIES.UNIT_SHIFT, data: this.unitshifts$, type: 'select' },
    { id: IDENTIFIES.WORKERS, data: this.workers$, type: 'table', columns: this.columnsWorker }
  ];

  ngOnInit() {
    this.store.dispatch(new UnitShiftActions.GetAll);
    if(!this.id) {
      this.store.dispatch(new WorkerActions.GetUnassignment)
    }
    else {
      this.loadExistingAssignment();
    }
  }

  private loadExistingAssignment(): void {
    this.store.dispatch(new WorkerActions.GetUnassignment(this.id))
    .pipe(
      switchMap(() => this.workers$.pipe(
        filter(workers => workers.length > 0),
        take(1)
      )),
      switchMap(() => this.store.dispatch(new AssignmentActions.GetById(this.id))),
      switchMap(() => this.entity$.pipe(
        filter(entity => !!entity),
        take(1)
      )),
      takeUntil(this.destroy$)
    )
    .subscribe(entity => {
      if (entity?.workers?.length) {
        entity.workers.forEach(worker => {
          this.store.dispatch(new WorkerActions.ToggleItemSelection(worker.id, TYPES.LIST))
          .pipe(takeUntil(this.destroy$));
        });
      }
    });
  }

  onSubmitted(event: any) {
    const verifiedAction = this.id
      ? new VerifiedAction.IfAssign(event.data.unit_shift_id, this.id)
      : new VerifiedAction.IfAssign(event.data.unit_shift_id)

    this.store.dispatch(verifiedAction)
    .subscribe(() => {
      this.$ifAssign
      .pipe(
        take(1),
        takeUntil(this.destroy$),
      )
      .subscribe((response: any) => {
        if(response.verified) {
          const textBottom = this.id ? 'Actualizar' : 'Guardar';
          this.sweetAlertService.confirmAction(response.title, response.message, textBottom, () => {
            this.onCreateOrUpdate(event, response.id);
          });
        } else {
          this.onCreateOrUpdate(event);
        }
      });
    });
  }

  private onCreateOrUpdate(event: any, param_id?: number) {
    const action = this.id
      ? new AssignmentActions.Update(this.id, event.data)
      : new AssignmentActions.Create(event.data);

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
      },
      complete: () => {
        if(!this.id) {
          this.store.dispatch(new WorkerActions.GetUnassignment)
        }
        if(param_id)
          this.updateState(event, param_id);
      }
    });
  }

  private updateState(event: any, id: number) {
    const newData = {...event.data}
    newData.state = false;
    this.store.dispatch(new AssignmentActions.Update(id, newData))
  }

  private handleSuccess(response: any, redirect: boolean): void {
    const result = response.assignment.result;
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
    this.store.dispatch(new AssignmentActions.clearEntity)
    this.store.dispatch(new WorkerActions.clearAll)
  }
}
