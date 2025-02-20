import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Company } from '@models/company.model';
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
import { CompanyActions } from '@state/company/company.actions';
import { CompanyState } from '@state/company/company.state';
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

  readonly title: string = TITLES.COMPANIES_REMOVE;
  readonly page: string = TYPES.RECYCLE;
  readonly columns: DataListColumn<Company>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.COMPANY);
  readonly colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.COMPANY);

  config: filterConfig = {
    search: true,
  }

  companies$: Observable<Company[] | null> = this.store.select(CompanyState.getTrasheds);
  areAllSelected$: Observable<boolean> = this.store.select(CompanyState.areTrashedAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(CompanyState.hasTrashedSelectedItems);
  selectedItems$: Observable<Company[]> = this.store.select(CompanyState.getTrashedSelectedItems);

  ngOnInit() {
    this.store.dispatch(new CompanyActions.GetTrasheds)
  }

  onDelete(id: number) {
    this.sweetalertService.confirmDelete(TITLES.COMPANY, MESSAGES.CONFIRM_DELETE, () => {
      this.onDeleteOrRecycle(id, true);
    })
  }

  onDeleteOrRecycle(id: number, del: boolean) {
    this.store.dispatch(new CompanyActions.Delete(id, del, TYPES.RECYCLE)).subscribe({
      next: (response: any)=> {
        this.sweetalertService.confirmSuccess(
          response.company.result.title,
          response.company.result.message
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
    this.sweetalertService.confirmRestore(TITLES.COMPANY, MESSAGES.CONFIRM_RESTORE, () => {
      this.store.dispatch(new CompanyActions.Restore(id)).subscribe({
        next: (response: any)=> {
          this.sweetalertService.confirmSuccess(
            response.company.result.title,
            response.company.result.message
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
    this.sweetalertService.confirmRestore(TITLES.COMPANIES, MESSAGES.CONFIRM_RESTORES, () => {
      this.selectedItems$
      .pipe(take(1))
      .subscribe(data => {
        this.store.dispatch(new CompanyActions.RestoreAll(data))
        .pipe(take(1))
        .subscribe({
          next: (response: any)=> {
            this.sweetalertService.confirmSuccess(
              response.company.result.title,
              response.company.result.message
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
    this.sweetalertService.confirmDelete(TITLES.COMPANIES, MESSAGES.CONFIRM_DELETES, () => {
      this.selectedItems$
      .pipe(take(1))
      .subscribe(data => {
        this.store.dispatch(new CompanyActions.DeleteAll(data, true, false, TYPES.RECYCLE))
        .pipe(take(1))
        .subscribe({
          next: (response: any)=> {
            this.sweetalertService.confirmSuccess(
              response.company.result.title,
              response.company.result.message
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
    this.store.dispatch(new CompanyActions.ToggleItemSelection(id, TYPES.RECYCLE));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new CompanyActions.ToggleAllItems(checked, TYPES.RECYCLE));
  }

  filtersData(filter: FilterStateModel) {
    this.store.dispatch(new CompanyActions.Filters(filter, TYPES.RECYCLE, this.colFiltered));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(new CompanyActions.ClearItemSelection);
  }
}
