import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, take } from 'rxjs';
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

@Component({
  selector: 'app-list',
  imports: [CommonModule, DataListComponent, NgIconsModule, TitlePageComponent, FilterComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  private store = inject(Store);
  private sweetalertService = inject(SweetalertService);
  private headerDataListService = inject(HeaderDatalistService);
  private notificationService = inject(NotificationService);

  title: string = TITLES.WORKERS;
  page: string = TYPES.LIST;
  columns: DataListColumn<Worker>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.WORKER);
  colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.WORKER);
  config: filterConfig = {
    typeworker: true,
  }

  workers$: Observable<Worker[] | null> = this.store.select(WorkerState.getItems);
  trashedWorkers$: Observable<Worker[] | null> = this.store.select(WorkerState.getTrasheds);
  areAllSelected$: Observable<boolean> = this.store.select(WorkerState.areAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(WorkerState.hasSelectedItems);
  selectedItems$: Observable<Worker[]> = this.store.select(WorkerState.getSelectedItems);

  ngOnInit() {
    this.store.dispatch(new WorkerActions.GetAll);
    this.onCountTrasheds();
  }

  onCountTrasheds() {
    this.store.dispatch(new WorkerActions.countDeletes);
  }

  onSearch(searchTerm: string) {
    this.store.dispatch(new WorkerActions.GetAllFilter(searchTerm, this.colFiltered));
  }

  onDelete(id: number) {
    this.sweetalertService.confirmRemoveOrDelete(TITLES.WORKER, MESSAGES.CONFIRM_DELETE_REMOVE, () => {
      this.onDeleteOrRecycle(id, true);
    }, () => {
      this.onDeleteOrRecycle(id, false);
    })
  }

  onDeleteOrRecycle(id: number, del: boolean) {
    this.store.dispatch(new WorkerActions.Delete(id, del)).subscribe({
      next: (response: any)=> {
        this.sweetalertService.confirmSuccess(
          response.worker.result.title,
          response.worker.result.message
        )
      },
      error: (error) => {
        const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
        this.notificationService.show(errors, "error");
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
      this.store.dispatch(new WorkerActions.DeleteAll(data, del))
      .pipe(take(1))
      .subscribe({
        next: (response: any)=> {
          this.sweetalertService.confirmSuccess(
            response.worker.result.title,
            response.worker.result.message
          )
        },
        error: (error) => {
          const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
          this.notificationService.show(errors, "error");
        },
        complete: () => {
          this.onCountTrasheds();
        }
      })
    })
  }

  onToggleItem(id: number) {
    this.store.dispatch(new WorkerActions.ToggleItemSelection(id));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new WorkerActions.ToggleAllItems(checked));
  }

  filtersData(filter: FilterStateModel) {
    this.store.dispatch(new WorkerActions.DropFilter(filter));
  }
}
