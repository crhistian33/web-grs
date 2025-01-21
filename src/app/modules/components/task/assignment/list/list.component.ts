import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, take } from 'rxjs';
import { Store } from '@ngxs/store';

import { TitlePageComponent } from '@shared/components/title-page/title-page.component';
import { MESSAGES, PARAMETERS, TITLES, TYPES } from '@shared/utils/constants';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { AssignmentActions } from '@state/assignment/assignment.actions';
import { Assignment } from '@models/assignment.model';
import { AssignmentState } from '@state/assignment/assignment.state';
import { DataListComponent } from '@shared/components/data-list/data-list.component';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { HeaderDatalistService } from '@shared/services/header-datalist.service';
import { FilterStateModel } from '@shared/models/filter.model';
import { filterConfig } from '@shared/models/filter-config.model';
import { Worker } from '@models/worker.model';
import { ActionsComponent } from '@shared/components/actions/actions.component';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { NotificationService } from '@shared/services/notification.service';

@Component({
  selector: 'app-list',
  imports: [CommonModule, TitlePageComponent, FilterComponent, DataListComponent, ActionsComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private readonly store = inject(Store);
  private readonly sweetalertService = inject(SweetalertService);
  private readonly headerDataListService = inject(HeaderDatalistService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  readonly title: string = TITLES.ASSIGNMENTS;
  readonly page: string = TYPES.NONE;
  readonly config: filterConfig = {
    company: true,
    customer: true,
    unit: true,
    shift: true,
  }
  readonly columns: DataListColumn<Assignment>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.ASSIGNMENT);
  readonly nestedColumns: DataListColumn<Worker>[] = this.headerDataListService.getInternal(PARAMETERS.WORKER);

  assignments: Assignment[] = [];
  filterAssignments: Assignment[] = [];

  assignments$: Observable<Assignment[]> = this.store.select(AssignmentState.getItems);
  areAllSelected$: Observable<boolean> = this.store.select(AssignmentState.areAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(AssignmentState.hasSelectedItems);
  selectedItems$: Observable<Assignment[]> = this.store.select(AssignmentState.getSelectedItems);

  getWorkers = (assignment: Assignment) => assignment.workers;

  ngOnInit() {
    this.store.dispatch(new AssignmentActions.GetAll);
  }

  onToggleItem(id: number) {
    this.store.dispatch(new AssignmentActions.ToggleItemSelection(id));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new AssignmentActions.ToggleAllItems(checked));
  }

  filtersData(filter: FilterStateModel) {
    this.store.dispatch(new AssignmentActions.Filters(filter));
  }

  onDelete(id: number) {
    this.sweetalertService.confirmDelete(
      TITLES.ASSIGNMENT,
      MESSAGES.CONFIRM_DELETES,
      () => {
        this.handleConfirmDelete(id, true);
      }
    );
  }

  handleConfirmDelete(id: number, del: boolean) {
    this.store.dispatch(new AssignmentActions.Delete(id, del)).subscribe({
      next: (response: any) => {
        this.sweetalertService.confirmSuccess(
          response.assignment.result.title,
          response.assignment.result.message
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
    this.sweetalertService.confirmDelete(TITLES.ASSIGNMENTS, MESSAGES.CONFIRM_DELETES, () => {
      this.handleConfirmDeleteAll(true)
    })
  }

  handleConfirmDeleteAll(del: boolean) {
    this.selectedItems$
    .pipe(take(1))
    .subscribe(data => {
      this.store.dispatch(new AssignmentActions.DeleteAll(data, del, true))
      .pipe(take(1))
      .subscribe({
        next: (response: any)=> {
          this.sweetalertService.confirmSuccess(
            response.assignment.result.title,
            response.assignment.result.message
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
    this.store.dispatch(new AssignmentActions.clearAll);
  }
}
