import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Center } from '@models/center.model';
import { Store } from '@ngxs/store';
import { FormBuilderComponent } from '@shared/components/formbuilder/formbuilder.component';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { PARAMETERS, ROUTES, TITLES } from '@shared/utils/constants';
import { CenterActions } from '@state/center/center.action';
import { CenterState } from '@state/center/center.state';
import { filter, Observable, Subject, take, takeUntil } from 'rxjs';

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
  readonly title: string = TITLES.CENTER;
  readonly route_list: string = ROUTES.CENTER_LIST;
  readonly module = PARAMETERS.CENTER;

  resetForm: boolean = false;
  entity$: Observable<Center | null> = this.store.select(CenterState.getEntity).pipe(filter(Boolean));

  ngOnInit() {
    if(this.id) {
      this.store.dispatch(new CenterActions.GetById(this.id));
    }
  }

  onSubmit(event: { data: any; redirect: boolean }) {
    const action = this.id
      ? new CenterActions.Update(this.id, event.data)
      : new CenterActions.Create(event.data);

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
    const result = response.center.result;
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
    this.store.dispatch(new CenterActions.clearEntity);
  }
}
