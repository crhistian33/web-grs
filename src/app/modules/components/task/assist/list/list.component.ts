import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Assist } from '@models/assist.model';
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
import { AssistActions } from '@state/assist/assist.actions';
import { AssistState } from '@state/assist/assist.state';
import { Observable, Subject, take } from 'rxjs';

@Component({
  selector: 'app-list',
  imports: [CommonModule, TitlePageComponent, DataListComponent, FilterComponent, ActionsComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private readonly store = inject(Store);
  private readonly sweetalertService = inject(SweetalertService);
  private readonly headerDataListService = inject(HeaderDatalistService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  readonly title: string = TITLES.ASSISTS;
  readonly page: string = TYPES.NONE;
  readonly config: filterConfig = {
    company: true,
    customer: true,
    unit: true,
    shift: true,
    fromDate: true,
    toDate: true,
  }
  readonly columns: DataListColumn<Assist>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.ASSIST);

  assists: Assist[] = [];
  filterAssists: Assist[] = [];

  assists$: Observable<Assist[]> = this.store.select(AssistState.getItems);
  areAllSelected$: Observable<boolean> = this.store.select(AssistState.areAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(AssistState.hasSelectedItems);
  selectedItems$: Observable<Assist[]> = this.store.select(AssistState.getSelectedItems);

  ngOnInit() {
    this.store.dispatch(new AssistActions.GetAll);
  }

  onToggleItem(id: number) {
    this.store.dispatch(new AssistActions.ToggleItemSelection(id));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new AssistActions.ToggleAllItems(checked));
  }

  filtersData(filter: FilterStateModel) {
    this.store.dispatch(new AssistActions.Filters(filter));
  }

  onDelete(id: number) {
    this.sweetalertService.confirmDelete(
      TITLES.ASSIST,
      MESSAGES.CONFIRM_DELETES,
      () => {
        this.handleConfirmDelete(id, true);
      }
    );
  }

  handleConfirmDelete(id: number, del: boolean) {
    this.store.dispatch(new AssistActions.Delete(id, del)).subscribe({
      next: (response: any) => {
        this.sweetalertService.confirmSuccess(
          response.assist.result.title,
          response.assist.result.message
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

  onDeleteAll() {
    this.sweetalertService.confirmDelete(TITLES.ASSISTS, MESSAGES.CONFIRM_DELETES, () => {
      this.handleConfirmDeleteAll(true)
    })
  }

  handleConfirmDeleteAll(del: boolean) {
    this.selectedItems$
    .pipe(take(1))
    .subscribe(data => {
      this.store.dispatch(new AssistActions.DeleteAll(data, del, true))
      .pipe(take(1))
      .subscribe({
        next: (response: any)=> {
          this.sweetalertService.confirmSuccess(
            response.assist.result.title,
            response.assist.result.message
          )
        },
        error: (error) => {
          const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
          this.notificationService.show(errors, "error");
        }
      })
    })
  }

  ngOnDestroy() {
    this.store.dispatch(new AssistActions.clearAll);
  }
}
