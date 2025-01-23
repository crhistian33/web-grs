import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Assignment } from '@models/assignment.model';
import { WorkerAssignment } from '@models/workerassignment.model';
import { Store } from '@ngxs/store';
import { ActionsComponent } from '@shared/components/actions/actions.component';
import { DataListComponent } from '@shared/components/data-list/data-list.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { ModalreassignComponent } from '@shared/components/modalreassign/modalreassign.component';
import { TitlePageComponent } from '@shared/components/title-page/title-page.component';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { filterConfig } from '@shared/models/filter-config.model';
import { FilterStateModel } from '@shared/models/filter.model';
import { HeaderDatalistService } from '@shared/services/header-datalist.service';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { MESSAGES, PARAMETERS, TITLES, TYPES } from '@shared/utils/constants';
import { AssignmentActions } from '@state/assignment/assignment.actions';
import { WorkerActions } from '@state/worker/worker.action';
import { WorkerAssignmentActions } from '@state/workerassignment/workerassignment.actions';
import { WorkerassignmentState } from '@state/workerassignment/workerassignment.state';
import { Observable, Subject, take } from 'rxjs';

@Component({
  selector: 'app-list',
  imports: [CommonModule, TitlePageComponent, FilterComponent, DataListComponent, ActionsComponent, ModalreassignComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private readonly store = inject(Store);
  private readonly sweetalertService = inject(SweetalertService);
  private readonly headerDataListService = inject(HeaderDatalistService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  readonly title: string = TITLES.REASSIGNMENTS;
  readonly page: string = TYPES.REASSIGN;
  readonly config: filterConfig = {
    company: true,
    customer: true,
    unit: true,
    shift: true,
  }
  readonly columns: DataListColumn<WorkerAssignment>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.REASSIGNMENT);

  isOpen: boolean = false;
  workerReassign!: WorkerAssignment;
  assignments: Assignment[] = [];
  filterAssignments: Assignment[] = [];

  workerassignments$: Observable<WorkerAssignment[]> = this.store.select(WorkerassignmentState.getItems);
  areAllSelected$: Observable<boolean> = this.store.select(WorkerassignmentState.areAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(WorkerassignmentState.hasSelectedItems);
  selectedItems$: Observable<WorkerAssignment[]> = this.store.select(WorkerassignmentState.getSelectedItems);

  ngOnInit() {
    this.store.dispatch(new WorkerAssignmentActions.GetAll);
  }

  onToggleItem(id: number) {
    this.store.dispatch(new WorkerAssignmentActions.ToggleItemSelection(id));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new WorkerAssignmentActions.ToggleAllItems(checked));
  }

  filtersData(filter: FilterStateModel) {
    this.store.dispatch(new WorkerAssignmentActions.Filters(filter));
  }

  onDelete(id: number) {
    this.sweetalertService.confirmDelete(
      TITLES.ASSIGNMENT,
      MESSAGES.CONFIRM_DELETE,
      () => {
        this.handleConfirmDelete(id, true);
      }
    );
  }

  handleConfirmDelete(id: number, del: boolean) {
    this.store.dispatch(new WorkerAssignmentActions.Delete(id, del)).subscribe({
      next: (response: any) => {
        this.sweetalertService.confirmSuccess(
          response.workerassignment.result.title,
          response.workerassignment.result.message
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
      this.store.dispatch(new WorkerAssignmentActions.DeleteAll(data, del, true))
      .pipe(take(1))
      .subscribe({
        next: (response: any)=> {
          this.sweetalertService.confirmSuccess(
            response.workerassignment.result.title,
            response.workerassignment.result.message
          )
        },
        error: (error) => {
          const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
          this.notificationService.show(errors, "error");
        }
      })
    })
  }

  onReassign(assign: any) {
    this.workerReassign = assign;
    this.isOpen = true;
  }

  // onReassignAll() {

  // }

  handleClose() {
    this.isOpen = false;
  }

  handleUpdate() {
    this.store.dispatch(new WorkerAssignmentActions.GetAll);
  }

  ngOnDestroy() {
    this.store.dispatch(new AssignmentActions.clearAll);
  }
}
