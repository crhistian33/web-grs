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
  selector: 'app-list',
  imports: [CommonModule, DataListComponent, TitlePageComponent, FilterComponent, ActionsComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private readonly store = inject(Store);
  private readonly sweetalertService = inject(SweetalertService);
  private readonly headerDataListService = inject(HeaderDatalistService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  readonly title: string = TITLES.CUSTOMERS;
  readonly page: string = TYPES.LIST;
  readonly columns: DataListColumn<Customer>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.CUSTOMER);
  readonly colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.CUSTOMER);

  companyId!: number;
  config!: filterConfig;
  customers$: Observable<Customer[] | null> = this.store.select(CustomerState.getItems);
  trashedItems$: Observable<Customer[] | null> = this.store.select(CustomerState.getTrasheds);
  areAllSelected$: Observable<boolean> = this.store.select(CustomerState.areAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(CustomerState.hasSelectedItems);
  selectedItems$: Observable<Customer[]> = this.store.select(CustomerState.getSelectedItems);

  ngOnInit() {
    const companies = this.store.selectSnapshot(UserState.getCurrentUserCompanies);
    if(companies) {
      if(companies.length > 1) {
        this.config = {
          company: true,
          search: true,
        }
      } else if(companies.length === 1) {
        this.companyId = companies[0].id;
        this.config = {
          search: true,
        }
      }
    }
    this.onCountTrasheds();
  }

  onCountTrasheds() {
    const action = this.companyId
      ? new CustomerActions.GetTrasheds(this.companyId)
      : new CustomerActions.GetTrasheds();

    this.store.dispatch(action);
  }

  onDelete(id: number) {
    this.sweetalertService.confirmRemoveOrDelete(
      TITLES.CUSTOMER,
      MESSAGES.CONFIRM_DELETE_REMOVE,
      () => {
        this.onDeleteOrRecycle(id, true);
      },
      () => {
        this.onDeleteOrRecycle(id, false);
      }
    );
  }

  onDeleteOrRecycle(id: number, del: boolean) {
    this.store.dispatch(new CustomerActions.Delete(id, del, TYPES.LIST)).subscribe({
      next: (response: any) => {
        this.sweetalertService.confirmSuccess(
          response.customer.result.title,
          response.customer.result.message
        );
      },
      error: (error) => {
        const status = error.status === 422 ? 'warning' : 'error';
        const errors: string[] = Array.isArray(error.error.message)
          ? error.error.message
          : [error.error.message];
        this.notificationService.show(errors || 'Ocurrió un error', status);
      },
      complete: () => {
        this.onCountTrasheds();
      },
    });
  }

  onDeleteAll() {
    this.sweetalertService.confirmRemoveOrDelete(
      TITLES.CUSTOMERS,
      MESSAGES.CONFIRM_DELETES_REMOVES,
      () => {
        this.onDeleteOrRecycleAll(true);
      },
      () => {
        this.onDeleteOrRecycleAll(false);
      }
    );
  }

  onDeleteOrRecycleAll(del: boolean) {
    this.selectedItems$.pipe(take(1)).subscribe((data) => {
      const action = this.companyId
        ? new CustomerActions.DeleteAll(data, del, true, TYPES.LIST, this.companyId)
        : new CustomerActions.DeleteAll(data, del, true, TYPES.LIST);

      this.store.dispatch(action)
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.sweetalertService.confirmSuccess(
            response.customer.result.title,
            response.customer.result.message
          );
        },
        error: (error) => {
          const status = error.status === 422 ? 'warning' : 'error';
          const errors: string[] = Array.isArray(error.error.message)
            ? error.error.message
            : [error.error.message];
          this.notificationService.show(errors || 'Ocurrió un error', status);
        },
        complete: () => {
          this.onCountTrasheds();
        },
      });
    });
  }

  onToggleItem(id: number) {
    this.store.dispatch(new CustomerActions.ToggleItemSelection(id, TYPES.LIST));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new CustomerActions.ToggleAllItems(checked, TYPES.LIST));
  }

  filtersData(filter: FilterStateModel) {
    this.store.dispatch(new CustomerActions.Filters(filter, TYPES.LIST, this.colFiltered));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(new CustomerActions.ClearItemSelection);
  }
}
