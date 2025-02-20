import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, map, Observable, Subject, take, tap } from 'rxjs';
import { Store } from '@ngxs/store';
import { NgIconsModule } from '@ng-icons/core';

import { WorkerActions } from '@state/worker/worker.action';
import { WorkerState } from '@state/worker/worker.state';
import { Worker } from '@models/worker.model';
import { DataListComponent } from '@shared/components/data-list/data-list.component';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { TitlePageComponent } from '@shared/components/title-page/title-page.component';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { HeaderDatalistService } from '@shared/services/header-datalist.service';
import { MESSAGES, PARAMETERS, TITLES, TYPES } from '@shared/utils/constants';
import { NotificationService } from '@shared/services/notification.service';
import { filterConfig } from '@shared/models/filter-config.model';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterStateModel } from '@shared/models/filter.model';
import { ActionsComponent } from '@shared/components/actions/actions.component';
import { Company } from '@models/company.model';
import { UserState } from '@state/user/user.state';
import { CompanyState } from '@state/company/company.state';

@Component({
  selector: 'app-list',
  imports: [CommonModule, DataListComponent, NgIconsModule, TitlePageComponent, FilterComponent, ActionsComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  private readonly store = inject(Store);
  private readonly headerDataListService = inject(HeaderDatalistService);
  private readonly sweetalertService = inject(SweetalertService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  readonly title: string = TITLES.WORKERS;
  readonly page: string = TYPES.LIST;
  readonly columns: DataListColumn<Worker>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.WORKER);
  readonly colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.WORKER);

  companyId!: number;
  config!: filterConfig;
  workers$: Observable<Worker[]> = this.store.select(WorkerState.getItems);
  trashedWorkers$: Observable<Worker[] | null> = this.store.select(WorkerState.getTrasheds);
  areAllSelected$: Observable<boolean> = this.store.select(WorkerState.areAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(WorkerState.hasSelectedItems);
  selectedItems$: Observable<Worker[]> = this.store.select(WorkerState.getSelectedItems);

  ngOnInit() {
    const companies = this.store.selectSnapshot(UserState.getCurrentUserCompanies);
    if(companies) {
      if(companies.length > 1) {
        this.config = {
          company: true,
          typeworker: true,
          search: true,
        }
      } else if(companies.length === 1) {
        this.companyId = companies[0].id;
        this.config  = {
          typeworker: true,
          search: true,
        }
      }
    }
    this.onCountTrasheds();
  }

  onCountTrasheds() {
    const action = this.companyId
      ? new WorkerActions.GetTrasheds(this.companyId)
      : new WorkerActions.GetTrasheds;

    this.store.dispatch(action);
  }

  onDelete(id: number) {
    this.sweetalertService.confirmRemoveOrDelete(TITLES.WORKER, MESSAGES.CONFIRM_DELETE_REMOVE, () => {
      this.onDeleteOrRecycle(id, true);
    }, () => {
      this.onDeleteOrRecycle(id, false);
    })
  }

  onDeleteOrRecycle(id: number, del: boolean) {
    this.store.dispatch(new WorkerActions.Delete(id, del, TYPES.LIST)).subscribe({
      next: (response: any)=> {
        this.sweetalertService.confirmSuccess(
          response.worker.result.title,
          response.worker.result.message
        )
      },
      error: (error) => {
        const status = error.status === 422 ? 'warning' : 'error';
        const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
        this.notificationService.show(errors || 'Ocurrió un error', status);
      },
      complete: () => {
        this.onCountTrasheds();
      }
    })
  }

  onDeleteAll() {
    this.sweetalertService.confirmRemoveOrDelete(TITLES.WORKERS, MESSAGES.CONFIRM_DELETES_REMOVES, () => {
      this.onDeleteOrRecycleAll(true)
    }, () => {
      this.onDeleteOrRecycleAll(false)
    })
  }

  onDeleteOrRecycleAll(del: boolean) {
    this.selectedItems$
    .pipe(take(1))
    .subscribe(data => {
      const action = this.companyId
        ? new WorkerActions.DeleteAll(data, del, true, TYPES.LIST, this.companyId)
        : new WorkerActions.DeleteAll(data, del, true, TYPES.LIST);

      this.store.dispatch(action)
      .pipe(take(1))
      .subscribe({
        next: (response: any)=> {
          this.sweetalertService.confirmSuccess(
            response.worker.result.title,
            response.worker.result.message
          )
        },
        error: (error) => {
          const status = error.status === 422 ? 'warning' : 'error';
          const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
          this.notificationService.show(errors || 'Ocurrió un error', status);
        },
        complete: () => {
          this.onCountTrasheds();
        }
      })
    })
  }

  onToggleItem(id: number) {
    this.store.dispatch(new WorkerActions.ToggleItemSelection(id, TYPES.LIST));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new WorkerActions.ToggleAllItems(checked, TYPES.LIST));
  }

  filtersData(filter: FilterStateModel) {
    this.store.dispatch(new WorkerActions.Filters(filter, TYPES.LIST, this.colFiltered));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(new WorkerActions.ClearItemSelection);
  }
}
