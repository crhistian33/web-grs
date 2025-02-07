import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from '@models/company.model';
import { Customer } from '@models/customer.model';
import { Store } from '@ngxs/store';
import { FormBuilderComponent } from '@shared/components/formbuilder/formbuilder.component';
import { SubEntity } from '@shared/models/subentity.model';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { IDENTIFIES, PARAMETERS, ROUTES, TITLES } from '@shared/utils/constants';
import { CompanyActions } from '@state/company/company.actions';
import { CompanyState } from '@state/company/company.state';
import { CustomerActions } from '@state/customer/customer.action';
import { CustomerState } from '@state/customer/customer.state';
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
  readonly title: string = TITLES.CUSTOMER;
  readonly route_list: string = ROUTES.CUSTOMER_LIST;
  readonly module = PARAMETERS.CUSTOMER;

  resetForm: boolean = false;

  companies$: Observable<Company[]> = this.store.select(CompanyState.getItems);
  entity$: Observable<Customer | null> = this.store.select(CustomerState.getEntity);

  readonly subentities: SubEntity[] = [
    { id: IDENTIFIES.COMPANY, data: this.companies$, type: 'select' }
  ]

  ngOnInit() {
    this.store.dispatch(new CompanyActions.GetAll);
    if(this.id) {
      this.store.dispatch(new CustomerActions.GetById(this.id));
    }
  }

  onSubmit(event: { data: any; redirect: boolean }) {
    const action = this.id
      ? new CustomerActions.Update(this.id, event.data)
      : new CustomerActions.Create(event.data);

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
    const result = response.customer.result;
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
    this.store.dispatch(new CustomerActions.clearEntity);
  }
}
