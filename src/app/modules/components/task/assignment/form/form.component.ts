import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Assignment } from '@models/assignment.model';
import { Store } from '@ngxs/store';
import { FormBuilderComponent } from '@shared/components/formbuilder/formbuilder.component';
import { SubEntity } from '@shared/models/subentity.model';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { IDENTIFIES, PARAMETERS, ROUTES, TITLES } from '@shared/utils/constants';
import { UnitActions } from '@state/unit/unit.actions';
import { UnitState } from '@state/unit/unit.state';
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
  entity!: Assignment;
  title: string = TITLES.ASSIGNMENT;
  route_list: string = ROUTES.ASSIGNMENT_LIST;
  resetForm: boolean = false;
  module = PARAMETERS.ASSIGNMENT;
  subentities: SubEntity[] = [];
  unitshifts: Observable<any[]> = this.store.select(UnitState.getItems);

  ngOnInit() {
    this.store.dispatch(new UnitActions.GetAllToShift);
    this.subentities = [
      { id: IDENTIFIES.UNIT_SHIFT, data: this.unitshifts }
    ]
  }

}
