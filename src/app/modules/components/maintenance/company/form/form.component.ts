import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from '@models/company.model';
import { Store } from '@ngxs/store';
import { FormBuilderComponent } from '@shared/components/formbuilder/formbuilder.component';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { PARAMETERS, ROUTES, TITLES } from '@shared/utils/constants';
import { CompanyActions } from '@state/company/company.actions';
import { CompanyState } from '@state/company/company.state';
import { filter, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-form',
  imports: [CommonModule, FormBuilderComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  private readonly store = inject(Store);
  private readonly sweetAlertService = inject(SweetalertService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  @Input() id!: number;
  readonly title: string = TITLES.COMPANY;
  readonly route_list: string = ROUTES.COMPANY_LIST;
  readonly module = PARAMETERS.COMPANY;

  resetForm: boolean = false;
  entity$: Observable<Company | null> = this.store.select(CompanyState.getEntity).pipe(filter(Boolean));

  ngOnInit() {
    if(this.id) {
      this.store.dispatch(new CompanyActions.GetById(this.id));
    }
  }

  onSubmit(event: { data: any; redirect: boolean }) {
    const action = this.id
      ? new CompanyActions.Update(this.id, event.data)
      : new CompanyActions.Create(event.data);

    this.store.dispatch(action)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: any) => {
        this.handleSuccess(response, event.redirect);
      },
      error: (error) => {
        this.notificationService.show(
          error.error?.message || 'Ocurrió un error',
          'error',
          5000
        );
      }
    });
  }

  private handleSuccess(response: any, redirect: boolean): void {
    const result = response.company.result;
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
    this.store.dispatch(new CompanyActions.clearEntity);
  }
}
