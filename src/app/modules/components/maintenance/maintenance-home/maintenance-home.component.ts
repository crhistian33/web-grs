import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Center } from '@models/center.model';
import { Company } from '@models/company.model';
import { Count } from '@models/counts.model';
import { Customer } from '@models/customer.model';
import { Shift } from '@models/shift.model';
import { TypeWorker } from '@models/type-worker.model';
import { Unit } from '@models/unit.model';
import { Worker } from '@models/worker.model';
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
import { UserState } from '@state/user/user.state';
import { WorkerActions } from '@state/worker/worker.action';
import { WorkerState } from '@state/worker/worker.state';
import { filter, map, Observable, Subject, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-maintenance-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './maintenance-home.component.html',
  styleUrl: './maintenance-home.component.scss'
})
export class MaintenanceHomeComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);

  //counts$: Observable<Count | null> = this.store.select(CountState.getCounts);
  workers$: Observable<Worker[]> = this.store.select(WorkerState.getItems);
  typeworkers$: Observable<TypeWorker[]> = this.store.select(TypeworkerState.getItems);
  centers$: Observable<Center[]> = this.store.select(CenterState.getItems);
  customers$: Observable<Customer[]> = this.store.select(CustomerState.getItems);
  units$: Observable<Unit[]> = this.store.select(UnitState.getItems);
  shifts$: Observable<Shift[]> = this.store.select(ShiftState.getItems);
  companies$: Observable<Company[]> = this.store.select(CompanyState.getItems);
  // companies$: Observable<Company[] | undefined> = this.store.select(UserState.getItem).pipe(
  //   map(user => user?.companies)
  // );

  ngOnInit(): void {
    // this.companies$.pipe(
    //   filter((companies): companies is Company[] => !!companies),
    //   take(1),
    //   tap(companies => {
    //     this.store.dispatch(new TypeWorkerActions.GetAll);
    //     this.store.dispatch(new CenterActions.GetAll);
    //     this.store.dispatch(new ShiftActions.GetAll);

    //     if (companies.length > 1) {
    //       this.store.dispatch(new WorkerActions.GetAll);
    //       this.store.dispatch(new CustomerActions.GetAll);
    //       this.store.dispatch(new UnitActions.GetAll);
    //     } else if (companies.length === 1) {
    //       const companyId = companies[0].id;
    //       this.store.dispatch(new WorkerActions.GetByCompany(companyId));
    //       this.store.dispatch(new CustomerActions.GetByCompany(companyId));
    //       this.store.dispatch(new UnitActions.GetByCompany(companyId));
    //     }
    //   })
    // ).subscribe();
  }

  ngOnDestroy(): void {
    this.store.dispatch(new CountActions.ClearCounts);
  }
}
