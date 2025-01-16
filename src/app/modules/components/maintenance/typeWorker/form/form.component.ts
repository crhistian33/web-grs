import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TypeWorker } from '@models/type-worker.model';
import { Store } from '@ngxs/store';
import { FormBuilderComponent } from '@shared/components/formbuilder/formbuilder.component';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { PARAMETERS, ROUTES, TITLES } from '@shared/utils/constants';
import { TypeWorkerActions } from '@state/typeworker/typeworker.action';

@Component({
  selector: 'app-form',
  imports: [FormBuilderComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  store = inject(Store);
  sweetAlertService = inject(SweetalertService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  @Input() id!: number;
  entity!: TypeWorker;
  title: string = TITLES.TYPEWORKER;
  route_list: string = ROUTES.TYPEWORKER_LIST;
  resetForm: boolean = false;
  module = PARAMETERS.TYPEWORKER;

  ngOnInit() {
    if(this.id) {
      this.store.dispatch(new TypeWorkerActions.GetById(this.id)).subscribe({
        next: (response: any) => {
          this.entity = response.typeworker.selectedEntity;
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
      this.store.dispatch(new TypeWorkerActions.Create(data))
      .subscribe({
        next: (response: any)=> {
          this.sweetAlertService.confirmSuccess(
            response.typeworker.result.title,
            response.typeworker.result.message,
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
      this.store.dispatch(new TypeWorkerActions.Update(this.id, data))
      .subscribe({
        next: (response: any)=> {
          this.sweetAlertService.confirmSuccess(
            response.typeworker.result.title,
            response.typeworker.result.message,
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
