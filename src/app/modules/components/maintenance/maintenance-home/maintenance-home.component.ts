import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Count } from '@models/counts.model';
import { Store } from '@ngxs/store';
import { CenterActions } from '@state/center/center.action';
import { CenterState } from '@state/center/center.state';
import { CompanyActions } from '@state/company/company.actions';
import { CompanyState } from '@state/company/company.state';
import { CountActions } from '@state/count/count.actions';
import { CountState } from '@state/count/count.state';
import { CustomerActions } from '@state/customer/customer.action';
import { CustomerState } from '@state/customer/customer.state';
import { ShiftActions } from '@state/shift/shift.action';
import { ShiftState } from '@state/shift/shift.state';
import { TypeWorkerActions } from '@state/typeworker/typeworker.action';
import { TypeworkerState } from '@state/typeworker/typeworker.state';
import { UnitActions } from '@state/unit/unit.actions';
import { UnitState } from '@state/unit/unit.state';
import { WorkerActions } from '@state/worker/worker.action';
import { WorkerState } from '@state/worker/worker.state';
import { map, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-maintenance-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './maintenance-home.component.html',
  styleUrl: './maintenance-home.component.scss'
})
export class MaintenanceHomeComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);

  counts$: Observable<Count | null> = this.store.select(CountState.getCounts);

  ngOnInit(): void {
    this.store.dispatch(new CountActions.GetCounts);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new CountActions.ClearCounts);
  }
}
