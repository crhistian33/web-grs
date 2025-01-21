import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';

import { WorkerActions } from '@state/worker/worker.action';
import { TypeWorker } from '@models/type-worker.model';
import { TypeWorkerActions } from '@state/typeworker/typeworker.action';
import { TypeworkerState } from '@state/typeworker/typeworker.state';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { Router } from '@angular/router';
import { IDENTIFIES, PARAMETERS, ROUTES, TITLES } from '@shared/utils/constants';
import { FormBuilderComponent } from '@shared/components/formbuilder/formbuilder.component';
import { SubEntity } from '@shared/models/subentity.model';
import { Worker } from '@models/worker.model';
import { WorkerState } from '@state/worker/worker.state';

@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule, FormBuilderComponent],
templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly sweetAlertService = inject(SweetalertService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  @Input() id!: number;
  readonly title: string = TITLES.WORKER;
  readonly route_list: string = ROUTES.WORKER_LIST;
  readonly module = PARAMETERS.WORKER;

  resetForm: boolean = false;
  typesWorker$: Observable<TypeWorker[]> = this.store.select(TypeworkerState.getItems);
  entity$: Observable<Worker | null> = this.store.select(WorkerState.getEntity);

  readonly subentities = [
    { id: IDENTIFIES.TYPEWORKER, data: this.typesWorker$ }
  ]

  ngOnInit() {
    this.store.dispatch(new TypeWorkerActions.GetAll);
    if(this.id) {
      this.store.dispatch(new WorkerActions.GetById(this.id));
    }
  }

  onSubmit(event: { data: any; redirect: boolean }) {
    const action = this.id
      ? new WorkerActions.Update(this.id, event.data)
      : new WorkerActions.Create(event.data);

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
    const result = response.worker.result;
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
    this.store.dispatch(new WorkerActions.clearEntity);
  }
}
