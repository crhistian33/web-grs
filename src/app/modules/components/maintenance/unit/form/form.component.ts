import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Center } from '@models/center.model';
import { Customer } from '@models/customer.model';
import { Unit } from '@models/unit.model';
import { Store } from '@ngxs/store';
import { FormBuilderComponent } from '@shared/components/formbuilder/formbuilder.component';
import { SubEntity } from '@shared/models/subentity.model';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { IDENTIFIES, PARAMETERS, ROUTES, TITLES } from '@shared/utils/constants';
import { CenterActions } from '@state/center/center.action';
import { CenterState } from '@state/center/center.state';
import { CustomerActions } from '@state/customer/customer.action';
import { CustomerState } from '@state/customer/customer.state';
import { UnitActions } from '@state/unit/unit.actions';
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
  entity!: Unit;
  title: string = TITLES.UNIT;
  route_list: string = ROUTES.UNIT_LIST;
  resetForm: boolean = false;
  module = PARAMETERS.UNIT;
  centers$: Observable<Center[]> = this.store.select(CenterState.getItems);
  customers$: Observable<Customer[]> = this.store.select(CustomerState.getItems);
  subentities: SubEntity[] = []

  ngOnInit() {
    this.store.dispatch(new CenterActions.GetAll);
    this.store.dispatch(new CustomerActions.GetAll);

    this.subentities = [
      { id: IDENTIFIES.CENTER, data: this.centers$ },
      { id: IDENTIFIES.CUSTOMER, data: this.customers$ }
    ];

    if(this.id) {
      this.store.dispatch(new UnitActions.GetById(this.id)).subscribe({
        next: (response: any) => {
          this.entity = response.unit.selectedEntity;
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
      this.store.dispatch(new UnitActions.Create(data))
      .subscribe({
        next: (response: any)=> {
          this.sweetAlertService.confirmSuccess(
            response.unit.result.title,
            response.unit.result.message,
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
      this.store.dispatch(new UnitActions.Update(this.id, data))
      .subscribe({
        next: (response: any)=> {
          this.sweetAlertService.confirmSuccess(
            response.unit.result.title,
            response.unit.result.message,
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
