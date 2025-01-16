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
  entity!: Center;
  title: string = TITLES.CENTER;
  route_list: string = ROUTES.CENTER_LIST;
  resetForm: boolean = false;
  module = PARAMETERS.CENTER;

  ngOnInit() {
    if(this.id) {
      this.store.dispatch(new CenterActions.GetById(this.id)).subscribe({
        next: (response: any) => {
          this.entity = response.center.selectedEntity;
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
      this.store.dispatch(new CenterActions.Create(data))
      .subscribe({
        next: (response: any)=> {
          this.sweetAlertService.confirmSuccess(
            response.center.result.title,
            response.center.result.message,
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
      this.store.dispatch(new CenterActions.Update(this.id, data))
      .subscribe({
        next: (response: any)=> {
          this.sweetAlertService.confirmSuccess(
            response.center.result.title,
            response.center.result.message,
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
