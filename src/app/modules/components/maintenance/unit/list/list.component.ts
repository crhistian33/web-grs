import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Unit } from '@models/unit.model';
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
import { UnitActions } from '@state/unit/unit.actions';
import { UnitState } from '@state/unit/unit.state';
import { UserState } from '@state/user/user.state';
import { catchError, Observable, Subject, take } from 'rxjs';

@Component({
  selector: 'app-list',
  imports: [CommonModule, DataListComponent, TitlePageComponent, FilterComponent, ActionsComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private readonly store = inject(Store);
  private readonly sweetalertService = inject(SweetalertService);
  private readonly headerDataListService = inject(HeaderDatalistService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  readonly title: string = TITLES.UNITS;
  readonly page: string = TYPES.LIST;
  readonly columns: DataListColumn<Unit>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.UNIT);
  readonly colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.UNIT);

  companyId!: number;
  config!: filterConfig;
  units$: Observable<Unit[] | null> = this.store.select(UnitState.getItems);
  trashedItems$: Observable<Unit[] | null> = this.store.select(UnitState.getTrasheds);
  areAllSelected$: Observable<boolean> = this.store.select(UnitState.areAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(UnitState.hasSelectedItems);
  selectedItems$: Observable<Unit[]> = this.store.select(UnitState.getSelectedItems);

  ngOnInit() {
    const companies = this.store.selectSnapshot(UserState.getCurrentUserCompanies);
    if (companies && companies.length > 1) {
      this.config = {
        company: true,
        customer: true,
        center: true,
        shift: true,
      }
    } else if (companies?.length === 1) {
      this.companyId = companies[0].id;
      this.config  = {
        customer: true,
        center: true,
        shift: true,
      }
    }
    this.onCountTrasheds();
  }

  onCountTrasheds() {
    const action = this.companyId
      ? new UnitActions.GetTrasheds(this.companyId)
      : new UnitActions.GetTrasheds;

    this.store.dispatch(action);
  }

  onDelete(id: number) {
    this.sweetalertService.confirmRemoveOrDelete(
      TITLES.UNIT,
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
    this.store.dispatch(new UnitActions.Delete(id, del, TYPES.LIST)).subscribe({
      next: (response: any) => {
        this.sweetalertService.confirmSuccess(
          response.unit.result.title,
          response.unit.result.message
        );
      },
      error: (error) => {
        const status = error.status === 422 ? 'warning' : 'error';
        const errors: string[] = Array.isArray(error.error.message)
          ? error.error.message
          : [error.error.message];
        this.notificationService.show(errors || 'Ocurrió un error', status);
      },
      complete: () => {
        this.onCountTrasheds();
      },
    });
  }

  onDeleteAll() {
    this.sweetalertService.confirmRemoveOrDelete(
      TITLES.UNITS,
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
    this.selectedItems$
    .pipe(take(1))
    .subscribe((data) => {
      const action = this.companyId
        ? new UnitActions.DeleteAll(data, del, true, TYPES.LIST, this.companyId)
        : new UnitActions.DeleteAll(data, del, true, TYPES.LIST);

      this.store.dispatch(action)
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.sweetalertService.confirmSuccess(
            response.unit.result.title,
            response.unit.result.message
          );
        },
        error: (error) => {
          const status = error.status === 422 ? 'warning' : 'error';
          const errors: string[] = Array.isArray(error.error.message)
            ? error.error.message
            : [error.error.message];
          this.notificationService.show(errors || 'Ocurrió un error', status);
        },
        complete: () => {
          this.onCountTrasheds();
        },
      });
    });
  }

  onToggleItem(id: number) {
    this.store.dispatch(new UnitActions.ToggleItemSelection(id, TYPES.LIST));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new UnitActions.ToggleAllItems(checked, TYPES.LIST));
  }

  filtersData(filter: FilterStateModel) {
    this.store.dispatch(new UnitActions.Filters(filter, TYPES.LIST, this.colFiltered));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(new UnitActions.ClearItemSelection);
  }
}
