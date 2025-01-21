import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { Shift } from '@models/shift.model';
import { FormBuilderComponent } from '@shared/components/formbuilder/formbuilder.component';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { PARAMETERS, ROUTES, TITLES } from '@shared/utils/constants';
import { ShiftActions } from '@state/shift/shift.action';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ShiftState } from '@state/shift/shift.state';

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
  readonly title: string = TITLES.SHIFT;
  readonly route_list: string = ROUTES.SHIFT_LIST;
  readonly module = PARAMETERS.SHIFT;

  resetForm: boolean = false;
  entity$: Observable<Shift | null> = this.store.select(ShiftState.getEntity);

  ngOnInit() {
    if(this.id) {
      this.store.dispatch(new ShiftActions.GetById(this.id));
    }
  }

  onSubmit(event: { data: any; redirect: boolean }) {
    const action = this.id
      ? new ShiftActions.Update(this.id, event.data)
      : new ShiftActions.Create(event.data);

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
    const result = response.shift.result;
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
    this.store.dispatch(new ShiftActions.clearEntity);
  }
}
