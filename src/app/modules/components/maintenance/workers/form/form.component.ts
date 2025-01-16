import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
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

@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule, FormBuilderComponent],
templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  private store = inject(Store);
  private sweetAlertService = inject(SweetalertService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  @Input() id!: number;
  entity!: Worker;
  title: string = TITLES.WORKER;
  route_list: string = ROUTES.WORKER_LIST;
  resetForm: boolean = false;
  module = PARAMETERS.WORKER;
  subentities: SubEntity[] = [];
  typesWorker$: Observable<TypeWorker[]> = this.store.select(TypeworkerState.getItems);

  ngOnInit() {
    this.store.dispatch(new TypeWorkerActions.GetAll);
    this.subentities = [
      { id: IDENTIFIES.TYPEWORKER, data: this.typesWorker$ }
    ]
    if(this.id) {
      this.store.dispatch(new WorkerActions.GetById(this.id)).subscribe({
        next: (response: any) => {
          this.entity = response.worker.selectedEntity;
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
      this.store.dispatch(new WorkerActions.Create(data))
      .subscribe({
        next: (response: any)=> {
          this.sweetAlertService.confirmSuccess(
            response.worker.result.title,
            response.worker.result.message,
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
        }
      })
    } else {
      this.store.dispatch(new WorkerActions.Update(this.id, data))
      .subscribe({
        next: (response: any)=> {
          this.sweetAlertService.confirmSuccess(
            response.worker.result.title,
            response.worker.result.message,
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
