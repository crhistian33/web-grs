import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Shift } from '@models/shift.model';
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
import { ShiftActions } from '@state/shift/shift.action';
import { ShiftState } from '@state/shift/shift.state';
import { Observable, Subject, take } from 'rxjs';

@Component({
  selector: 'app-removes',
  imports: [CommonModule, DataListComponent, TitlePageComponent, ActionsComponent, FilterComponent],
  templateUrl: './removes.component.html',
  styleUrl: './removes.component.scss'
})
export class RemovesComponent {
  private readonly store = inject(Store);
  private readonly sweetalertService = inject(SweetalertService);
  private readonly headerDataListService = inject(HeaderDatalistService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  readonly title: string = TITLES.SHIFTS_REMOVE;
  readonly page: string = TYPES.RECYCLE;
  readonly columns: DataListColumn<Shift>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.SHIFT);
  readonly colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.SHIFT);

  config: filterConfig = {
    search: true,
  }

  shifts$: Observable<Shift[] | null> = this.store.select(ShiftState.getTrasheds);
  areAllSelected$: Observable<boolean> = this.store.select(ShiftState.areTrashedAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(ShiftState.hasTrashedSelectedItems);
  selectedItems$: Observable<Shift[]> = this.store.select(ShiftState.getTrashedSelectedItems);

  ngOnInit() {
    this.store.dispatch(new ShiftActions.GetTrasheds)
  }

  onDelete(id: number) {
    this.sweetalertService.confirmDelete(TITLES.SHIFT, MESSAGES.CONFIRM_DELETE, () => {
      this.onDeleteOrRecycle(id, true);
    })
  }

  onDeleteOrRecycle(id: number, del: boolean) {
    this.store.dispatch(new ShiftActions.Delete(id, del, TYPES.RECYCLE)).subscribe({
      next: (response: any)=> {
        this.sweetalertService.confirmSuccess(
          response.shift.result.title,
          response.shift.result.message
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
    this.sweetalertService.confirmRestore(TITLES.SHIFT, MESSAGES.CONFIRM_RESTORE, () => {
      this.store.dispatch(new ShiftActions.Restore(id)).subscribe({
        next: (response: any)=> {
          this.sweetalertService.confirmSuccess(
            response.shift.result.title,
            response.shift.result.message
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
    this.sweetalertService.confirmRestore(TITLES.SHIFTS, MESSAGES.CONFIRM_RESTORES, () => {
      this.selectedItems$
      .pipe(take(1))
      .subscribe(data => {
        this.store.dispatch(new ShiftActions.RestoreAll(data))
        .pipe(take(1))
        .subscribe({
          next: (response: any)=> {
            this.sweetalertService.confirmSuccess(
              response.shift.result.title,
              response.shift.result.message
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
    this.sweetalertService.confirmDelete(TITLES.SHIFTS, MESSAGES.CONFIRM_DELETES, () => {
      this.selectedItems$
      .pipe(take(1))
      .subscribe(data => {
        this.store.dispatch(new ShiftActions.DeleteAll(data, true, false, TYPES.RECYCLE))
        .pipe(take(1))
        .subscribe({
          next: (response: any)=> {
            this.sweetalertService.confirmSuccess(
              response.shift.result.title,
              response.shift.result.message
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
    this.store.dispatch(new ShiftActions.ToggleItemSelection(id, TYPES.RECYCLE));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new ShiftActions.ToggleAllItems(checked, TYPES.RECYCLE));
  }

  filtersData(filter: FilterStateModel) {
    this.store.dispatch(new ShiftActions.Filters(filter, TYPES.RECYCLE, this.colFiltered));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(new ShiftActions.ClearItemSelection);
  }
}
