import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Inassist } from '@models/inassist.model';
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
import { InassistAction } from '@state/inassist/inassist.actions';
import { InassistState } from '@state/inassist/inassist.state';
import { map, Observable, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list',
  imports: [CommonModule, TitlePageComponent, FilterComponent, ActionsComponent, DataListComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private readonly store = inject(Store);
  private readonly headerDataListService = inject(HeaderDatalistService);
  private readonly sweetalertService = inject(SweetalertService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  readonly title: string = TITLES.PERMISSIONS;
  readonly page: string = TYPES.LIST;
  readonly columns: DataListColumn<Inassist>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.BREAK);
  readonly colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.BREAK);

  companyId!: number;
  config!: filterConfig;

  areAllSelected$: Observable<boolean> = this.store.select(InassistState.areAllSelected).pipe(takeUntil(this.destroy$));
  hasSelectedItems$: Observable<boolean> = this.store.select(InassistState.hasSelectedItems).pipe(takeUntil(this.destroy$));
  selectedItems$: Observable<Inassist[]> = this.store.select(InassistState.getSelectedItems).pipe(takeUntil(this.destroy$));

  onDelete(event: { id: number, month: number }): void {
    const { id, month } = event;
    this.sweetalertService.confirmDelete(
      TITLES.BREAK,
      MESSAGES.CONFIRM_DELETES,
      () => this.handleConfirmDelete(id, month)
    );
  }

  handleConfirmDelete(id: number, month: number): void {
    this.store.dispatch(new InassistAction.Delete(id, +month))
      .pipe(
        takeUntil(this.destroy$),  // Cancel if component is destroyed
        take(1)                    // Complete after first emission
      )
      .subscribe({
        next: (response: any) => {
          this.sweetalertService.confirmSuccess(
            response.inassist.result.title,
            response.inassist.result.message
          );
        },
        error: (error) => {
          const errors: string[] = Array.isArray(error.error.message)
            ? error.error.message
            : [error.error.message];
          this.notificationService.show(errors, 'error');
        },
      });
  }

  onDeleteAll(): void {
    this.sweetalertService.confirmDelete(
      TITLES.BREAKS,
      MESSAGES.CONFIRM_DELETES,
      () => this.handleConfirmDeleteAll(true)
    );
  }

  handleConfirmDeleteAll(del: boolean): void {
    this.selectedItems$
      .pipe(
        take(1),
        map(data => data.map(item => ({
          worker_id: item.worker.id,
          month: item.month
        })))
      )
      .subscribe(dataMap => {
        this.store.dispatch(new InassistAction.DeleteAll(dataMap))
        .pipe(
          takeUntil(this.destroy$),
          take(1)
        )
        .subscribe({
          next: (response: any) => {
            this.sweetalertService.confirmSuccess(
              response.inassist.result.title,
              response.inassist.result.message
            );
          },
          error: (error) => {
            const errors: string[] = Array.isArray(error.error.message)
              ? error.error.message
              : [error.error.message];
            this.notificationService.show(errors, "error");
          }
        });
      });
  }

  onToggleItem(id: number): void {
    this.store.dispatch(new InassistAction.ToggleItemSelection(id, TYPES.LIST));
  }

  onToggleAll(checked: boolean): void {
    this.store.dispatch(new InassistAction.ToggleAllItems(checked, TYPES.LIST));
  }

  filtersData(filter: FilterStateModel): void {
    this.store.dispatch(new InassistAction.Filters(filter, TYPES.LIST, this.colFiltered));
  }
}
