import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { CenterActions } from '@state/center/center.action';
import { CenterState } from '@state/center/center.state';
import { CompanyActions } from '@state/company/company.actions';
import { CompanyState } from '@state/company/company.state';
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
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-maintenance-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './maintenance-home.component.html',
  styleUrl: './maintenance-home.component.scss'
})
export class MaintenanceHomeComponent {
  private store = inject(Store);

  centers$: Observable<number> = this.store.select(CenterState.getItems).pipe(map(items => items.length));
  companies$: Observable<number> = this.store.select(CompanyState.getItems).pipe(map(items => items.length));
  customers$: Observable<number> = this.store.select(CustomerState.getItems).pipe(map(items => items.length));
  shifts$: Observable<number> = this.store.select(ShiftState.getItems).pipe(map(items => items.length));
  typeworkers$: Observable<number> = this.store.select(TypeworkerState.getItems).pipe(map(items => items.length));
  units$: Observable<number> = this.store.select(UnitState.getItems).pipe(map(items => items.length));
  workers$: Observable<number> = this.store.select(WorkerState.getItems).pipe(map(items => items.length));

  ngOnInit() {
    this.store.dispatch(CenterActions.GetAll);
    this.store.dispatch(CompanyActions.GetAll);
    this.store.dispatch(CustomerActions.GetAll);
    this.store.dispatch(ShiftActions.GetAll);
    this.store.dispatch(TypeWorkerActions.GetAll);
    this.store.dispatch(UnitActions.GetAll);
    this.store.dispatch(WorkerActions.GetAll);
  }
}
