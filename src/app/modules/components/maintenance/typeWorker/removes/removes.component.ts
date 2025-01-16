import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TypeWorker } from '@models/type-worker.model';
import { NgIconsModule } from '@ng-icons/core';
import { Store } from '@ngxs/store';
import { DataListComponent } from '@shared/components/data-list/data-list.component';
import { TitlePageComponent } from '@shared/components/title-page/title-page.component';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { HeaderDatalistService } from '@shared/services/header-datalist.service';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { MESSAGES, PARAMETERS, TITLES, TYPES } from '@shared/utils/constants';
import { TypeWorkerActions } from '@state/typeworker/typeworker.action';
import { TypeworkerState } from '@state/typeworker/typeworker.state';
import { Observable, take } from 'rxjs';

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

  title: string = TITLES.TYPEWORKERS_REMOVE;
  page: string = TYPES.RECYCLE;
  columns: DataListColumn<TypeWorker>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.TYPEWORKER);
  colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.TYPEWORKER);

  typeWorkers$: Observable<TypeWorker[] | null> = this.store.select(TypeworkerState.getItems);
  areAllSelected$: Observable<boolean> = this.store.select(TypeworkerState.areAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(TypeworkerState.hasSelectedItems);
  selectedItems$: Observable<TypeWorker[]> = this.store.select(TypeworkerState.getSelectedItems);

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.store.dispatch(new TypeWorkerActions.GetDeletes)
  }

  onSearch(searchTerm: string) {
    this.store.dispatch(new TypeWorkerActions.GetAllFilter(searchTerm, this.colFiltered));
  }

  onDelete(id: number) {
    this.sweetalertService.confirmDelete(TITLES.TYPEWORKER, MESSAGES.CONFIRM_DELETE, () => {
      this.onDeleteOrRecycle(id, true);
    })
  }

  onDeleteOrRecycle(id: number, del: boolean) {
    this.store.dispatch(new TypeWorkerActions.Delete(id, del)).subscribe({
      next: (response: any)=> {
        this.sweetalertService.confirmSuccess(
          response.typeworker.result.title,
          response.typeworker.result.message
        )
      },
      error: (error) => {
        const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
        this.notificationService.show(errors, "error");
      },
    })
  }

  onRestore(id: number) {
    this.sweetalertService.confirmRestore(TITLES.TYPEWORKER, MESSAGES.CONFIRM_RESTORE, () => {
      this.store.dispatch(new TypeWorkerActions.Restore(id)).subscribe({
        next: (response: any)=> {
          this.sweetalertService.confirmSuccess(
            response.typeworker.result.title,
            response.typeworker.result.message
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
    this.sweetalertService.confirmRestore(TITLES.TYPEWORKERS, MESSAGES.CONFIRM_RESTORES, () => {
      this.selectedItems$
      .pipe(take(1))
      .subscribe(data => {
        this.store.dispatch(new TypeWorkerActions.RestoreAll(data))
        .pipe(take(1))
        .subscribe({
          next: (response: any)=> {
            this.sweetalertService.confirmSuccess(
              response.typeworker.result.title,
              response.typeworker.result.message
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
    this.sweetalertService.confirmDelete(TITLES.TYPEWORKERS, MESSAGES.CONFIRM_DELETES, () => {
      this.selectedItems$
      .pipe(take(1))
      .subscribe(data => {
        this.store.dispatch(new TypeWorkerActions.DeleteAll(data, true))
        .pipe(take(1))
        .subscribe({
          next: (response: any)=> {
            this.sweetalertService.confirmSuccess(
              response.typeworker.result.title,
              response.typeworker.result.message
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
    this.store.dispatch(new TypeWorkerActions.ToggleItemSelection(id));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new TypeWorkerActions.ToggleAllItems(checked));
  }
}
