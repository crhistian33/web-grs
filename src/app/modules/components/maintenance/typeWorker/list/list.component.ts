import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TypeWorker } from '@models/type-worker.model';
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
  selector: 'app-list',
  imports: [CommonModule, DataListComponent, TitlePageComponent, DataListComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  private store = inject(Store);
  private sweetalertService = inject(SweetalertService);
  private headerDataListService = inject(HeaderDatalistService);
  private notificationService = inject(NotificationService);

  title: string = TITLES.TYPEWORKERS;
  page: string = TYPES.LIST;
  columns: DataListColumn<TypeWorker>[] =
    this.headerDataListService.getHeaderDataList(PARAMETERS.TYPEWORKER);
  colFiltered: string[] = this.headerDataListService.getFiltered(
    PARAMETERS.TYPEWORKER
  );

  typeWorkers$: Observable<TypeWorker[] | null> = this.store.select(
    TypeworkerState.getItems
  );
  trashedTypeWorkers$: Observable<TypeWorker[] | null> = this.store.select(
    TypeworkerState.getTrasheds
  );
  areAllSelected$: Observable<boolean> = this.store.select(
    TypeworkerState.areAllSelected
  );
  hasSelectedItems$: Observable<boolean> = this.store.select(
    TypeworkerState.hasSelectedItems
  );
  selectedItems$: Observable<TypeWorker[]> = this.store.select(
    TypeworkerState.getSelectedItems
  );

  ngOnInit() {
    this.store.dispatch(new TypeWorkerActions.GetAll());
    this.onCountTrasheds();
  }

  onCountTrasheds() {
    this.store.dispatch(new TypeWorkerActions.countDeletes());
  }

  onSearch(searchTerm: string) {
    this.store.dispatch(
      new TypeWorkerActions.GetAllFilter(searchTerm, this.colFiltered)
    );
  }

  onDelete(id: number) {
    this.sweetalertService.confirmRemoveOrDelete(
      TITLES.TYPEWORKER,
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
    this.store.dispatch(new TypeWorkerActions.Delete(id, del)).subscribe({
      next: (response: any) => {
        this.sweetalertService.confirmSuccess(
          response.typeworker.result.title,
          response.typeworker.result.message
        );
      },
      error: (error) => {
        const errors: string[] = Array.isArray(error.error.message)
          ? error.error.message
          : [error.error.message];
        this.notificationService.show(errors, 'error');
      },
      complete: () => {
        this.onCountTrasheds();
      },
    });
  }

  onDeleteAll() {
    this.sweetalertService.confirmRemoveOrDelete(
      TITLES.TYPEWORKERS,
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
      this.store
        .dispatch(new TypeWorkerActions.DeleteAll(data, del))
        .pipe(take(1))
        .subscribe({
          next: (response: any) => {
            this.sweetalertService.confirmSuccess(
              response.typeworker.result.title,
              response.typeworker.result.message
            );
          },
          error: (error) => {
            const errors: string[] = Array.isArray(error.error.message)
              ? error.error.message
              : [error.error.message];
            this.notificationService.show(errors, 'error');
          },
          complete: () => {
            this.onCountTrasheds();
          },
        });
    });
  }

  onToggleItem(id: number) {
    this.store.dispatch(new TypeWorkerActions.ToggleItemSelection(id));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new TypeWorkerActions.ToggleAllItems(checked));
  }
}
