import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subject, combineLatest, filter, switchMap, take, takeUntil, tap } from 'rxjs';

import { IDENTIFIES, PARAMETERS, ROUTES, TITLES, TYPES } from '@shared/utils/constants';
import { Assignment } from '@models/assignment.model';
import { Worker } from '@models/worker.model';
import { FormBuilderComponent } from '@shared/components/formbuilder/formbuilder.component';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { AssignmentActions } from '@state/assignment/assignment.actions';
import { AssignmentState } from '@state/assignment/assignment.state';
import { VerifiedAction } from '@shared/state/verified/verified.actions';
import { VerifiedState } from '@shared/state/verified/verified.state';
import { UnitShiftActions } from '@state/unitshift/unitshift.actions';
import { UnitshiftState } from '@state/unitshift/unitshift.state';
import { UnitShift } from '@models/unitshift.model';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { SubEntity } from '@shared/models/subentity.model';
import { HeaderDatalistService } from '@shared/services/header-datalist.service';
import { UserState } from '@state/user/user.state';
import { WorkerFormState } from '@state/worker-form/worker-form.state';
import { WorkerFormAction } from '@state/worker-form/worker-form.actions';

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

  companyId!: number;
  unitshifts$: Observable<UnitShift[]> = this.store.select(UnitshiftState.getItems);
  workers$: Observable<Worker[]> = this.store.select(WorkerFormState.getItems);
  selectedItems$: Observable<Worker[]> = this.store.select(WorkerFormState.getSelectedItems);
  entity$: Observable<Assignment | null> = this.store.select(AssignmentState.getEntity);
  ifAssign$: Observable<boolean> = this.store.select(VerifiedState.getVerified);

  readonly subentities: SubEntity[] = [];

  constructor() {
    this.subentities = [
      { id: IDENTIFIES.UNIT_SHIFT, data: this.unitshifts$, type: 'select' },
      { id: IDENTIFIES.WORKERS, data: this.workers$, type: 'table', columns: this.columnsWorker }
    ];
  }

  ngOnInit() {
    const companies = this.store.selectSnapshot(UserState.getCurrentUserCompanies);
    if(companies) {
      if(companies.length > 1) {
        this.store.dispatch(new UnitShiftActions.GetAll);
      } else if(companies.length === 1) {
        this.companyId = companies[0].id;
        this.store.dispatch(new UnitShiftActions.GetAll(this.companyId));
      }
    }
    if(this.id)
      this.store.dispatch(new AssignmentActions.GetById(this.id));
  }

  private loadExistingAssignment(): void {
    combineLatest([
      this.entity$.pipe(
        filter((entity): entity is Assignment => !!entity && Array.isArray(entity.workers) && entity.workers.length > 0)
      ),
      this.workers$.pipe(
        filter((workers): workers is Worker[] => !!workers?.length)
      )
    ])
    .pipe(
      take(1),
      switchMap(([entity, workers]) => {
        const selectionActions = entity.workers
          .filter(worker => workers.some(w => w.id === worker.id))
          .map(worker =>
            this.store.dispatch(new WorkerFormAction.ToggleItemSelection(worker.id, TYPES.LIST))
          );

        return selectionActions.length ? combineLatest(selectionActions) : [];
      }),
      takeUntil(this.destroy$)
    )
    .subscribe({
      error: () => {
        this.notificationService.show(['Error al cargar los trabajadores'], 'error', 5000);
      }
    });
  }

  loadWorkers(company_id: number) {
    this.companyId = company_id;
    const action = this.id
      ? new WorkerFormAction.GetUnassigns({ assignment_id: this.id, company_id })
      : new WorkerFormAction.GetUnassigns({ company_id });

    this.store.dispatch(action).pipe(
      switchMap(() => this.workers$.pipe(
        filter(workers => !!workers?.length),
        take(1)
      )),
      tap(() => {
        if (this.id) {
          this.loadExistingAssignment();
        }
      }),
      takeUntil(this.destroy$)
    )
    .subscribe();
  }

  onSubmitted(event: any) {
    const verifiedAction = this.id
      ? new VerifiedAction.IfAssign(event.data.unit_shift_id, this.id)
      : new VerifiedAction.IfAssign(event.data.unit_shift_id)

    this.store.dispatch(verifiedAction)
    .subscribe(() => {
      this.ifAssign$
      .pipe(
        take(1),
        takeUntil(this.destroy$),
      )
      .subscribe((response: any) => {
        if(response.verified) {
          const textBottom = this.id ? 'Actualizar' : 'Guardar';
          this.sweetAlertService.confirmAction(response.title, response.message, textBottom, () => {
            this.onCreateOrUpdate(event);
            this.updateState(response.id);
          });
        } else {
          this.onCreateOrUpdate(event);
        }
      });
    });
  }

  private onCreateOrUpdate(event: any) {
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
    });
  }

  private updateState(id: number) {
    this.store.dispatch(new AssignmentActions.Desactivate(id))
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
          const action = this.id
            ? new WorkerFormAction.GetUnassigns({ assignment_id: this.id, company_id: this.companyId })
            : new WorkerFormAction.GetUnassigns({ company_id: this.companyId });
          this.store.dispatch(action);
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
    this.store.dispatch(new AssignmentActions.clearAll);
    this.store.dispatch(new WorkerFormAction.clearAll);
    this.store.dispatch(new WorkerFormAction.ClearItemSelection);
  }
}
