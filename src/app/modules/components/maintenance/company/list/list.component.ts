import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Company } from '@models/company.model';
import { Store } from '@ngxs/store';
import { DataListComponent } from '@shared/components/data-list/data-list.component';
import { TitlePageComponent } from '@shared/components/title-page/title-page.component';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { HeaderDatalistService } from '@shared/services/header-datalist.service';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { MESSAGES, PARAMETERS, TITLES, TYPES } from '@shared/utils/constants';
import { CompanyActions } from '@state/company/company.actions';
import { CompanyState } from '@state/company/company.state';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-list',
  imports: [CommonModule, DataListComponent, TitlePageComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private store = inject(Store);
  private sweetalertService = inject(SweetalertService);
  private headerDataListService = inject(HeaderDatalistService);
  private notificationService = inject(NotificationService);

  title: string = TITLES.COMPANIES;
  page: string = TYPES.LIST;
  columns: DataListColumn<Company>[] =
    this.headerDataListService.getHeaderDataList(PARAMETERS.COMPANY);
  colFiltered: string[] = this.headerDataListService.getFiltered(
    PARAMETERS.COMPANY
  );

  companies$: Observable<Company[] | null> = this.store.select(
    CompanyState.getItems
  );
  trashedItems$: Observable<Company[] | null> = this.store.select(
    CompanyState.getTrasheds
  );
  areAllSelected$: Observable<boolean> = this.store.select(
    CompanyState.areAllSelected
  );
  hasSelectedItems$: Observable<boolean> = this.store.select(
    CompanyState.hasSelectedItems
  );
  selectedItems$: Observable<Company[]> = this.store.select(
    CompanyState.getSelectedItems
  );

  ngOnInit() {
    this.store.dispatch(new CompanyActions.GetAll());
    this.onCountTrasheds();
  }

  onCountTrasheds() {
    this.store.dispatch(new CompanyActions.countDeletes());
  }

  onSearch(searchTerm: string) {
    this.store.dispatch(
      new CompanyActions.GetAllFilter(searchTerm, this.colFiltered)
    );
  }

  onDelete(id: number) {
    this.sweetalertService.confirmRemoveOrDelete(
      TITLES.COMPANY,
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
    this.store.dispatch(new CompanyActions.Delete(id, del)).subscribe({
      next: (response: any) => {
        this.sweetalertService.confirmSuccess(
          response.company.result.title,
          response.company.result.message
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
      TITLES.COMPANIES,
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
        .dispatch(new CompanyActions.DeleteAll(data, del))
        .pipe(take(1))
        .subscribe({
          next: (response: any) => {
            this.sweetalertService.confirmSuccess(
              response.company.result.title,
              response.company.result.message
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
    this.store.dispatch(new CompanyActions.ToggleItemSelection(id));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new CompanyActions.ToggleAllItems(checked));
  }
}
