import { inject, Injectable } from '@angular/core';
import { User } from '@models/user.model';
import { Store } from '@ngxs/store';
import { CenterActions } from '@state/center/center.action';
import { CompanyActions } from '@state/company/company.actions';
import { CustomerActions } from '@state/customer/customer.action';
import { ShiftActions } from '@state/shift/shift.action';
import { TypeWorkerActions } from '@state/typeworker/typeworker.action';
import { UnitActions } from '@state/unit/unit.actions';
import { UserState } from '@state/user/user.state';
import { WorkerActions } from '@state/worker/worker.action';
import { catchError, forkJoin, map, Observable, of, retry, switchMap, take, tap, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitialLoaderService {
  private readonly store = inject(Store);
  private readonly currentUser$ = this.store.select(UserState.getItem);

  load(): Observable<boolean> {
    return this.currentUser$.pipe(
      take(1),
      switchMap(user => user ? this.loadDependentData(user) : of(false)),
      timeout(15000),
      retry({
        count: 2,
        delay: 1000
      }),
      catchError(this.handleError)
    );
  }

  loadAsync(): void {
    this.load().subscribe();
  }

  private loadDependentData(user: User): Observable<boolean> {
    return forkJoin({
      companies: this.store.dispatch(new CompanyActions.GetAll(user.companies)),
      data: this.getActionsByCompanyCount(user)
    }).pipe(
      map(() => true),
      catchError(this.handleError)
    );
  }

  private getActionsByCompanyCount(user: User): Observable<any> {
    const commonActions = this.getCommonActions();
    const specificActions = user.companies.length > 1
      ? this.getMultiCompanyActions()
      : this.getSingleCompanyActions(user.companies[0].id);

    return this.store.dispatch([...specificActions, ...commonActions]);
  }

  private getCommonActions(): any[] {
    return [
      new TypeWorkerActions.GetAll(),
      new CenterActions.GetAll(),
      new ShiftActions.GetAll()
    ];
  }

  private getMultiCompanyActions(): any[] {
    return [
      new WorkerActions.GetAll(),
      new CustomerActions.GetAll(),
      new UnitActions.GetAll()
    ];
   }

   private getSingleCompanyActions(companyId: number): any[] {
    return [
      new WorkerActions.GetByCompany(companyId),
      new CustomerActions.GetByCompany(companyId),
      new UnitActions.GetByCompany(companyId)
    ];
   }

  private handleError = (error: any): Observable<boolean> => {
    console.error('[InitialLoader] Error:', error);
    return of(false);
  }
}
