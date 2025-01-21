import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TypeWorker } from '@models/type-worker.model';
import { Store } from '@ngxs/store';
import { FormBuilderComponent } from '@shared/components/formbuilder/formbuilder.component';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { PARAMETERS, ROUTES, TITLES } from '@shared/utils/constants';
import { TypeWorkerActions } from '@state/typeworker/typeworker.action';
import { TypeworkerState } from '@state/typeworker/typeworker.state';
import { Observable, Subject, takeUntil } from 'rxjs';

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
  private readonly destroy$ = new Subject<void>();

  @Input() id!: number;
  readonly title: string = TITLES.TYPEWORKER;
  readonly route_list: string = ROUTES.TYPEWORKER_LIST;
  readonly module = PARAMETERS.TYPEWORKER;

  resetForm: boolean = false;
  entity$: Observable<TypeWorker | null> = this.store.select(TypeworkerState.getEntity);

  ngOnInit() {
    if(this.id) {
      this.store.dispatch(new TypeWorkerActions.GetById(this.id));
    }
  }

  onSubmit(event: { data: any; redirect: boolean }) {
    const action = this.id
      ? new TypeWorkerActions.Update(this.id, event.data)
      : new TypeWorkerActions.Create(event.data);

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
    const result = response.typeworker.result;
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
    this.store.dispatch(new TypeWorkerActions.clearEntity);
  }
}
