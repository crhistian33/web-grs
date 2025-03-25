import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnitShift } from '@models/unitshift.model';
import { WorkerAssignment } from '@models/workerassignment.model';
import { NgIconsModule } from '@ng-icons/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { Store } from '@ngxs/store';
import { NavfloatComponent } from '@shared/components/navfloat/navfloat.component';
import { UnitShiftActions } from '@state/unitshift/unitshift.actions';
import { UnitshiftState } from '@state/unitshift/unitshift.state';
import { UserState } from '@state/user/user.state';
import { WorkerAssignmentActions } from '@state/workerassignment/workerassignment.actions';
import { WorkerassignmentState } from '@state/workerassignment/workerassignment.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form',
  imports: [CommonModule, NgSelectModule, NgIconsModule, NavfloatComponent, ReactiveFormsModule],
templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private today = new Date().toISOString().split('T')[0];

  companyId!: number;
  myForm!: FormGroup;
  unitshifts$: Observable<UnitShift[]> = this.store.select(UnitshiftState.getItems);
  workers$: Observable<WorkerAssignment[]> = this.store.select(WorkerassignmentState.getItems);

  ngOnInit(): void {
    this.myForm = this.fb.group({
      start_date: [this.today, Validators.required],
      unit_shift_id: [, Validators.required]
    });

    const companies = this.store.selectSnapshot(UserState.getCurrentUserCompanies);
    if(companies) {
      if(companies.length > 1) {
        this.store.dispatch(new UnitShiftActions.GetAll);
      } else if(companies.length === 1) {
        this.companyId = companies[0].id;
        this.store.dispatch(new UnitShiftActions.GetAll(this.companyId));
      }
    }
  }

  loadWorkers(event: any) {
    const id = event.id;
    this.store.dispatch(new WorkerAssignmentActions.GetWorkerToUnit(id, this.today));
  }

}
