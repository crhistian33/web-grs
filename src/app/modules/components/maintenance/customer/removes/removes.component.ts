import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Customer } from '@models/customer.model';
import { Store } from '@ngxs/store';
import { DataListComponent } from '@shared/components/data-list/data-list.component';
import { TitlePageComponent } from '@shared/components/title-page/title-page.component';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { HeaderDatalistService } from '@shared/services/header-datalist.service';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { MESSAGES, PARAMETERS, TITLES, TYPES } from '@shared/utils/constants';
import { CustomerActions } from '@state/customer/customer.action';
import { CustomerState } from '@state/customer/customer.state';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-removes',
  imports: [CommonModule, DataListComponent, TitlePageComponent],
  templateUrl: './removes.component.html',
  styleUrl: './removes.component.scss'
})
export class RemovesComponent {
  private store = inject(Store);
  private sweetalertService = inject(SweetalertService);
  private headerDataListService = inject(HeaderDatalistService);
  private notificationService = inject(NotificationService);

  title: string = TITLES.CUSTOMERS_REMOVE;
  page: string = TYPES.RECYCLE;
  columns: DataListColumn<Customer>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.CUSTOMER);
  colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.CUSTOMER);

  customers$: Observable<Customer[] | null> = this.store.select(CustomerState.getItems);
  areAllSelected$: Observable<boolean> = this.store.select(CustomerState.areAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(CustomerState.hasSelectedItems);
  selectedItems$: Observable<Customer[]> = this.store.select(CustomerState.getSelectedItems);

  ngOnInit() {
    this.store.dispatch(new CustomerActions.GetDeletes)
  }

  onSearch(searchTerm: string) {
    this.store.dispatch(new CustomerActions.GetAllFilter(searchTerm, this.colFiltered));
  }

  onDelete(id: number) {
    this.sweetalertService.confirmDelete(TITLES.CUSTOMER, MESSAGES.CONFIRM_DELETE, () => {
      this.onDeleteOrRecycle(id, true);
    })
  }

  onDeleteOrRecycle(id: number, del: boolean) {
    this.store.dispatch(new CustomerActions.Delete(id, del)).subscribe({
      next: (response: any)=> {
        this.sweetalertService.confirmSuccess(
          response.customer.result.title,
          response.customer.result.message
        )
      },
      error: (error) => {
        const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
        this.notificationService.show(errors, "error");
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
          const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
          this.notificationService.show(errors, "error");
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
            const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
            this.notificationService.show(errors, "error");
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
        this.store.dispatch(new CustomerActions.DeleteAll(data, true))
        .pipe(take(1))
        .subscribe({
          next: (response: any)=> {
            this.sweetalertService.confirmSuccess(
              response.customer.result.title,
              response.customer.result.message
            )
          },
          error: (error) => {
            const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
            this.notificationService.show(errors, "error");
          },
        })
      })
    })
  }

  onToggleItem(id: number) {
    this.store.dispatch(new CustomerActions.ToggleItemSelection(id));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new CustomerActions.ToggleAllItems(checked));
  }
}
