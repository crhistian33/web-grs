import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Shift } from '@models/shift.model';
import { Store } from '@ngxs/store';
import { ActionsComponent } from '@shared/components/actions/actions.component';
import { DataListComponent } from '@shared/components/data-list/data-list.component';
import { TitlePageComponent } from '@shared/components/title-page/title-page.component';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { HeaderDatalistService } from '@shared/services/header-datalist.service';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { MESSAGES, PARAMETERS, TITLES, TYPES } from '@shared/utils/constants';
import { ShiftActions } from '@state/shift/shift.action';
import { ShiftState } from '@state/shift/shift.state';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-removes',
  imports: [CommonModule, DataListComponent, TitlePageComponent, ActionsComponent],
  templateUrl: './removes.component.html',
  styleUrl: './removes.component.scss'
})
export class RemovesComponent {
  private store = inject(Store);
  private sweetalertService = inject(SweetalertService);
  private headerDataListService = inject(HeaderDatalistService);
  private notificationService = inject(NotificationService);

  title: string = TITLES.SHIFTS_REMOVE;
  page: string = TYPES.RECYCLE;
  columns: DataListColumn<Shift>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.SHIFT);
  colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.SHIFT);

  shifts$: Observable<Shift[] | null> = this.store.select(ShiftState.getItems);
  areAllSelected$: Observable<boolean> = this.store.select(ShiftState.areAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(ShiftState.hasSelectedItems);
  selectedItems$: Observable<Shift[]> = this.store.select(ShiftState.getSelectedItems);

  ngOnInit() {
    this.store.dispatch(new ShiftActions.GetDeletes)
  }

  onDelete(id: number) {
    this.sweetalertService.confirmDelete(TITLES.SHIFT, MESSAGES.CONFIRM_DELETE, () => {
      this.onDeleteOrRecycle(id, true);
    })
  }

  onDeleteOrRecycle(id: number, del: boolean) {
    this.store.dispatch(new ShiftActions.Delete(id, del)).subscribe({
      next: (response: any)=> {
        this.sweetalertService.confirmSuccess(
          response.shift.result.title,
          response.shift.result.message
        )
      },
      error: (error) => {
        const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
        this.notificationService.show(errors, "error");
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
          const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
          this.notificationService.show(errors, "error");
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
            const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
            this.notificationService.show(errors, "error");
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
        this.store.dispatch(new ShiftActions.DeleteAll(data, true, false))
        .pipe(take(1))
        .subscribe({
          next: (response: any)=> {
            this.sweetalertService.confirmSuccess(
              response.shift.result.title,
              response.shift.result.message
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
    this.store.dispatch(new ShiftActions.ToggleItemSelection(id));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new ShiftActions.ToggleAllItems(checked));
  }
}
