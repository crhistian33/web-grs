import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Assignment } from '@models/assignment.model';
import { WorkerAssignment } from '@models/workerassignment.model';
import { Store } from '@ngxs/store';
import { ActionsComponent } from '@shared/components/actions/actions.component';
import { DataListComponent } from '@shared/components/data-list/data-list.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
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
import { FormComponent } from '../form/form.component';
import { UserState } from '@state/user/user.state';

@Component({
  selector: 'app-list',
  imports: [CommonModule, TitlePageComponent, FilterComponent, DataListComponent, ActionsComponent, ModalComponent, FormComponent],
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
  readonly columns: DataListColumn<WorkerAssignment>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.REASSIGNMENT);
  readonly colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.REASSIGNMENT);

  companyId!: number;
  config!: filterConfig;
  titleModal: string = TITLES.REASSIGN_WORKER;
  isOpen: boolean = false;
  workerReassign!: WorkerAssignment;
  assignments: Assignment[] = [];
  filterAssignments: Assignment[] = [];

  workerassignments$: Observable<WorkerAssignment[]> = this.store.select(WorkerassignmentState.getItems);
  areAllSelected$: Observable<boolean> = this.store.select(WorkerassignmentState.areAllSelected);
  hasSelectedItems$: Observable<boolean> = this.store.select(WorkerassignmentState.hasSelectedItems);
  selectedItems$: Observable<WorkerAssignment[]> = this.store.select(WorkerassignmentState.getSelectedItems);

  ngOnInit() {
    this.initializeComponent();
  }

  private initializeComponent(): void {
    const companies = this.store.selectSnapshot(UserState.getCurrentUserCompanies);
    if (!companies) {
      return;
    }

    if (companies.length > 1) {
      this.store.dispatch(new WorkerAssignmentActions.GetAll);
      this.config = {
        company: true,
        customer: true,
        unit: true,
        shift: true,
        search: true,
      }
    } else if (companies.length === 1) {
      this.companyId = companies[0].id;
      this.store.dispatch(new WorkerAssignmentActions.GetAll(this.companyId));
      this.config = {
        search: true,
        customer: true,
        unit: true,
        shift: true,
      };
    }
  }

  onToggleItem(id: number) {
    this.store.dispatch(new WorkerAssignmentActions.ToggleItemSelection(id, TYPES.LIST));
  }

  onToggleAll(checked: boolean) {
    this.store.dispatch(new WorkerAssignmentActions.ToggleAllItems(checked, TYPES.LIST));
  }

  filtersData(filter: FilterStateModel) {
    this.store.dispatch(new WorkerAssignmentActions.Filters(filter, TYPES.LIST, this.colFiltered));
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
    this.store.dispatch(new WorkerAssignmentActions.Delete(id, del, TYPES.LIST)).subscribe({
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

  // handleUpdate() {
  //   this.store.dispatch(new WorkerAssignmentActions.GetAll);
  // }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(new WorkerAssignmentActions.ClearItemSelection);
  }
}
