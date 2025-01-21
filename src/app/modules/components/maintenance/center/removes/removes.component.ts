import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Center } from '@models/center.model';
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
import { CenterActions } from '@state/center/center.action';
import { CenterState } from '@state/center/center.state';
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

  readonly title: string = TITLES.CENTERS_REMOVE;
  readonly page: string = TYPES.RECYCLE;
  readonly columns: DataListColumn<Center>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.CENTER);
  readonly colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.CENTER);

  config: filterConfig = {
    search: true,
  }

  centers$: Observable<Center[] | null> = this.store.select(CenterState.getItems);
  areAllSelected$: Observable<boolean> = this.store.select(CenterState.areAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(CenterState.hasSelectedItems);
  selectedItems$: Observable<Center[]> = this.store.select(CenterState.getSelectedItems);

  ngOnInit() {
    this.store.dispatch(new CenterActions.GetDeletes)
  }

  onDelete(id: number) {
    this.sweetalertService.confirmDelete(TITLES.CENTER, MESSAGES.CONFIRM_DELETE, () => {
      this.onDeleteOrRecycle(id, true);
    })
  }

  onDeleteOrRecycle(id: number, del: boolean) {
    this.store.dispatch(new CenterActions.Delete(id, del)).subscribe({
      next: (response: any)=> {
        this.sweetalertService.confirmSuccess(
          response.center.result.title,
          response.center.result.message
        )
      },
      error: (error) => {
        const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
        this.notificationService.show(errors, "error");
      },
    })
  }

  onRestore(id: number) {
    this.sweetalertService.confirmRestore(TITLES.CENTER, MESSAGES.CONFIRM_RESTORE, () => {
      this.store.dispatch(new CenterActions.Restore(id)).subscribe({
        next: (response: any)=> {
          this.sweetalertService.confirmSuccess(
            response.center.result.title,
            response.center.result.message
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
    this.sweetalertService.confirmRestore(TITLES.CENTERS, MESSAGES.CONFIRM_RESTORES, () => {
      this.selectedItems$
      .pipe(take(1))
      .subscribe(data => {
        this.store.dispatch(new CenterActions.RestoreAll(data))
        .pipe(take(1))
        .subscribe({
          next: (response: any)=> {
            this.sweetalertService.confirmSuccess(
              response.center.result.title,
              response.center.result.message
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
    this.sweetalertService.confirmDelete(TITLES.CENTERS, MESSAGES.CONFIRM_DELETES, () => {
      this.selectedItems$
      .pipe(take(1))
      .subscribe(data => {
        this.store.dispatch(new CenterActions.DeleteAll(data, true, false))
        .pipe(take(1))
        .subscribe({
          next: (response: any)=> {
            this.sweetalertService.confirmSuccess(
              response.center.result.title,
              response.center.result.message
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
    this.store.dispatch(new CenterActions.ToggleItemSelection(id));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new CenterActions.ToggleAllItems(checked));
  }

  filtersData(filter: FilterStateModel) {
    this.store.dispatch(new CenterActions.Filters(filter, this.colFiltered));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(new CenterActions.clearAll);
  }
}
