import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { NgIconsModule } from '@ng-icons/core';

import { Worker } from '@models/worker.model';
import { WorkerActions } from '@state/worker/worker.action';
import { WorkerState } from '@state/worker/worker.state';
import { DataListComponent } from '@shared/components/data-list/data-list.component';
import { TitlePageComponent } from '@shared/components/title-page/title-page.component';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { HeaderDatalistService } from '@shared/services/header-datalist.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { MESSAGES, PARAMETERS, TITLES, TYPES } from '@shared/utils/constants';
import { Observable, Subject, take } from 'rxjs';
import { NotificationService } from '@shared/services/notification.service';
import { ActionsComponent } from '@shared/components/actions/actions.component';
import { filterConfig } from '@shared/models/filter-config.model';
import { FilterStateModel } from '@shared/models/filter.model';
import { FilterComponent } from '@shared/components/filter/filter.component';

@Component({
  selector: 'app-removes',
  imports: [CommonModule, DataListComponent, NgIconsModule, TitlePageComponent, FilterComponent, ActionsComponent],
  templateUrl: './removes.component.html',
  styleUrl: './removes.component.scss'
})
export class RemovesComponent {
  private readonly store = inject(Store);
  private readonly sweetalertService = inject(SweetalertService);
  private readonly headerDataListService = inject(HeaderDatalistService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  readonly title: string = TITLES.WORKERS_REMOVE;
  readonly page: string = TYPES.RECYCLE;
  readonly columns: DataListColumn<Worker>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.WORKER);
  readonly colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.WORKER);

  workers$: Observable<Worker[] | null> = this.store.select(WorkerState.getItems);
  areAllSelected$: Observable<boolean> = this.store.select(WorkerState.areAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(WorkerState.hasSelectedItems);
  selectedItems$: Observable<Worker[]> = this.store.select(WorkerState.getSelectedItems);

  config: filterConfig = {
    typeworker: true,
    search: true,
  }

  ngOnInit() {
    this.getWorkers();
  }

  getWorkers() {
    this.store.dispatch(new WorkerActions.GetDeletes)
  }

  onDelete(id: number) {
    this.sweetalertService.confirmDelete(TITLES.WORKER, MESSAGES.CONFIRM_DELETE, () => {
      this.onDeleteOrRecycle(id, true);
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
        this.notificationService.show(errors || 'Error ocurred', 'error');
      },
    })
  }

  onRestore(id: number) {
    this.sweetalertService.confirmRestore(TITLES.WORKER, MESSAGES.CONFIRM_RESTORE, () => {
      this.store.dispatch(new WorkerActions.Restore(id)).subscribe({
        next: (response: any)=> {
          this.sweetalertService.confirmSuccess(
            response.worker.result.title,
            response.worker.result.message
          )
        },
        error: (error) => {
          const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
          this.notificationService.show(errors || 'Error ocurred', 'error');
        },
      })
    })
  }

  onRestoreAll() {
    this.sweetalertService.confirmRestore(TITLES.WORKERS, MESSAGES.CONFIRM_RESTORES, () => {
      this.selectedItems$
      .pipe(take(1))
      .subscribe(data => {
        this.store.dispatch(new WorkerActions.RestoreAll(data))
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
        })
      })
    })
  }

  onDeleteAll() {
    this.sweetalertService.confirmDelete(TITLES.WORKERS, MESSAGES.CONFIRM_DELETES, () => {
      this.selectedItems$
      .pipe(take(1))
      .subscribe(data => {
        this.store.dispatch(new WorkerActions.DeleteAll(data, true, false))
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
        })
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
    this.store.dispatch(new WorkerActions.Filters(filter, this.colFiltered));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(new WorkerActions.clearAll);
  }
}
