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
import { Observable, take } from 'rxjs';
import { NotificationService } from '@shared/services/notification.service';

@Component({
  selector: 'app-removes',
  imports: [CommonModule, DataListComponent, NgIconsModule, TitlePageComponent],
  templateUrl: './removes.component.html',
  styleUrl: './removes.component.scss'
})
export class RemovesComponent {
  private store = inject(Store);
  private sweetalertService = inject(SweetalertService);
  private headerDataListService = inject(HeaderDatalistService);
  private notificationService = inject(NotificationService);

  title: string = TITLES.WORKERS_REMOVE;
  page: string = TYPES.RECYCLE;
  columns: DataListColumn<Worker>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.WORKER);
  colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.WORKER);

  workers$: Observable<Worker[] | null> = this.store.select(WorkerState.getItems);
  areAllSelected$: Observable<boolean> = this.store.select(WorkerState.areAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(WorkerState.hasSelectedItems);
  selectedItems$: Observable<Worker[]> = this.store.select(WorkerState.getSelectedItems);

  ngOnInit() {
    this.getWorkers();
  }

  getWorkers() {
    this.store.dispatch(new WorkerActions.GetDeletes)
  }

  onSearch(searchTerm: string) {
    this.store.dispatch(new WorkerActions.GetAllFilter(searchTerm, this.colFiltered));
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
        this.notificationService.show(errors, "error");
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
          this.notificationService.show(errors, "error");
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
        this.store.dispatch(new WorkerActions.DeleteAll(data, true))
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
}
