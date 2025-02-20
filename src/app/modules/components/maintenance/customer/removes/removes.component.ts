import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Customer } from '@models/customer.model';
import { Store } from '@ngxs/store';
import { ActionsComponent } from '@shared/components/actions/actions.component';
import { DataListComponent } from '@shared/components/data-list/data-list.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { TitlePageComponent } from '@shared/components/title-page/title-page.component';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { filterConfig } from '@shared/models/filter-config.model';
import { FilterStateModel } from '@shared/models/filter.model';
import { HeaderDatalistService } from '@shared/services/header-datalist.service';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { MESSAGES, PARAMETERS, TITLES, TYPES } from '@shared/utils/constants';
import { CustomerActions } from '@state/customer/customer.action';
import { CustomerState } from '@state/customer/customer.state';
import { UserState } from '@state/user/user.state';
import { Observable, Subject, take } from 'rxjs';

@Component({
  selector: 'app-removes',
  imports: [CommonModule, DataListComponent, TitlePageComponent, FilterComponent, ActionsComponent],
  templateUrl: './removes.component.html',
  styleUrl: './removes.component.scss'
})
export class RemovesComponent {
  private readonly store = inject(Store);
  private readonly sweetalertService = inject(SweetalertService);
  private readonly headerDataListService = inject(HeaderDatalistService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  readonly title: string = TITLES.CUSTOMERS_REMOVE;
  readonly  page: string = TYPES.RECYCLE;
  readonly columns: DataListColumn<Customer>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.CUSTOMER);
  readonly colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.CUSTOMER);


  companyId!: number;
  config!: filterConfig;
  customers$: Observable<Customer[] | null> = this.store.select(CustomerState.getTrasheds);
  areAllSelected$: Observable<boolean> = this.store.select(CustomerState.areTrashedAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(CustomerState.hasTrashedSelectedItems);
  selectedItems$: Observable<Customer[]> = this.store.select(CustomerState.getTrashedSelectedItems);

  ngOnInit() {
    this.getTrasheds();
  }

  getTrasheds() {
    const companies = this.store.selectSnapshot(UserState.getCurrentUserCompanies);
    if(companies) {
      if(companies.length > 1) {
        this.store.dispatch(new CustomerActions.GetTrasheds);
        this.config = {
          company: true,
          search: true,
        }
      } else if(companies.length === 1) {
        this.companyId = companies[0].id;
        this.store.dispatch(new CustomerActions.GetTrasheds(this.companyId));
        this.config = {
          search: true,
        }
      }
    }
  }

  onDelete(id: number) {
    this.sweetalertService.confirmDelete(TITLES.CUSTOMER, MESSAGES.CONFIRM_DELETE, () => {
      this.onDeleteOrRecycle(id, true);
    })
  }

  onDeleteOrRecycle(id: number, del: boolean) {
    this.store.dispatch(new CustomerActions.Delete(id, del, TYPES.RECYCLE)).subscribe({
      next: (response: any)=> {
        this.sweetalertService.confirmSuccess(
          response.customer.result.title,
          response.customer.result.message
        )
      },
      error: (error) => {
        const status = error.status === 422 ? 'warning' : 'error';
        const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
        this.notificationService.show(errors || 'Ocurrió un error', status);
      },
    })
  }

  onRestore(id: number) {
    this.sweetalertService.confirmRestore(TITLES.CUSTOMER, MESSAGES.CONFIRM_RESTORE, () => {
      this.store.dispatch(new CustomerActions.Restore(id)).subscribe({
        next: (response: any)=> {
          this.sweetalertService.confirmSuccess(
            response.customer.result.title,
            response.customer.result.message
          )
        },
        error: (error) => {
          const status = error.status === 422 ? 'warning' : 'error';
          const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
          this.notificationService.show(errors || 'Ocurrió un error', status);
        },
      })
    })
  }

  onRestoreAll() {
    this.sweetalertService.confirmRestore(TITLES.CUSTOMERS, MESSAGES.CONFIRM_RESTORES, () => {
      this.selectedItems$
      .pipe(take(1))
      .subscribe(data => {
        this.store.dispatch(new CustomerActions.RestoreAll(data))
        .pipe(take(1))
        .subscribe({
          next: (response: any)=> {
            this.sweetalertService.confirmSuccess(
              response.customer.result.title,
              response.customer.result.message
            )
          },
          error: (error) => {
            const status = error.status === 422 ? 'warning' : 'error';
            const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
            this.notificationService.show(errors || 'Ocurrió un error', status);
          },
        })
      })
    })
  }

  onDeleteAll() {
    this.sweetalertService.confirmDelete(TITLES.CUSTOMERS, MESSAGES.CONFIRM_DELETES, () => {
      this.selectedItems$
      .pipe(take(1))
      .subscribe(data => {
        const action = this.companyId
          ? new CustomerActions.DeleteAll(data, true, false, TYPES.RECYCLE, this.companyId)
          : new CustomerActions.DeleteAll(data, true, false, TYPES.RECYCLE);

        this.store.dispatch(action)
        .pipe(take(1))
        .subscribe({
          next: (response: any)=> {
            this.sweetalertService.confirmSuccess(
              response.customer.result.title,
              response.customer.result.message
            )
          },
          error: (error) => {
            const status = error.status === 422 ? 'warning' : 'error';
            const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
            this.notificationService.show(errors || 'Ocurrió un error', status);
          },
        })
      })
    })
  }

  onToggleItem(id: number) {
    this.store.dispatch(new CustomerActions.ToggleItemSelection(id, TYPES.RECYCLE));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new CustomerActions.ToggleAllItems(checked, TYPES.RECYCLE));
  }

  filtersData(filter: FilterStateModel) {
    this.store.dispatch(new CustomerActions.Filters(filter, TYPES.RECYCLE, this.colFiltered));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(new CustomerActions.ClearItemSelection);
  }
}
