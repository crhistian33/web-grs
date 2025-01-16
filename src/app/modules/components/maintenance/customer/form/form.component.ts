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
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form',
  imports: [CommonModule, FormBuilderComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  private store = inject(Store);
  private sweetAlertService = inject(SweetalertService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  @Input() id!: number;
  entity!: Customer;
  title: string = TITLES.CUSTOMER;
  route_list: string = ROUTES.CUSTOMER_LIST;
  resetForm: boolean = false;
  module = PARAMETERS.CUSTOMER;
  subentities: SubEntity[] = []
  companies$: Observable<Company[]> = this.store.select(CompanyState.getItems);

  ngOnInit() {
    this.store.dispatch(new CompanyActions.GetAll);
    this.subentities = [
      { id: IDENTIFIES.COMPANY, data: this.companies$ }
    ]

    if(this.id) {
      this.store.dispatch(new CustomerActions.GetById(this.id)).subscribe({
        next: (response: any) => {
          this.entity = response.customer.selectedEntity;
        },
        error: (error) => {
          this.notificationService.show(error.error.message, "error", 5000);
        }
      })
    }
  }

  onSubmit(submitted: any) {
    const { data, redirect } = submitted;
    if(!this.id) {
      this.store.dispatch(new CustomerActions.Create(data))
      .subscribe({
        next: (response: any)=> {
          this.sweetAlertService.confirmSuccess(
            response.customer.result.title,
            response.customer.result.message,
            () => {
              if(redirect) {
                this.router.navigate([this.route_list]);
              } else {
                this.resetForm = true;
              }
            }
          );
        },
        error: (error) => {
          this.notificationService.show(error.error.message, 'error', 5000)
        },
        complete: () => {
          this.resetForm = false;
        }
      })
    } else {
      this.store.dispatch(new CustomerActions.Update(this.id, data))
      .subscribe({
        next: (response: any)=> {
          this.sweetAlertService.confirmSuccess(
            response.customer.result.title,
            response.customer.result.message,
            () => { this.router.navigate([this.route_list]); }
          );
        },
        error: (error) => {
          this.notificationService.show(error.error.message, 'error', 5000)
        }
      })
    }
  }
}
